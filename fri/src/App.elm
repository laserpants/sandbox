module App exposing (Flags, Msg(..), State, init, subscriptions, update, view)

import Browser exposing (Document)
import Browser.Navigation as Navigation
import Data.Project exposing (Project)
import Data.Session as Session exposing (Session)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Maybe.Extra as Maybe
import Page exposing (..)
import Ports
import Route exposing (Route(..), fromUrl)
import Ui
import Update.Deep exposing (..)
import Update.Deep.Router as Router
import Url exposing (Url)


type alias Flags =
    { session : String
    , apiUrl : String
    , basePath : String
    }


type Msg
    = RouterMsg Router.Msg
    | PageMsg Page.Msg
    | UiMsg Ui.Msg
    | AcceptCookies


type alias State =
    { session : Maybe Session
    , router : Router.State Route
    , ui : Ui.State
    , restrictedUrl : Maybe String
    , page : Page
    , cookiesAccepted : Bool
    }


setRestrictedUrl : Url -> State -> Update State msg a
setRestrictedUrl url state =
    save { state | restrictedUrl = Just (String.dropLeft (String.length state.router.basePath) url.path) }


resetRestrictedUrl : State -> Update State msg a
resetRestrictedUrl state =
    save { state | restrictedUrl = Nothing }


setSession : Maybe Session -> State -> Update State msg a
setSession session state =
    save { state | session = session }


setWorkingProject : Project -> State -> Update State msg a
setWorkingProject project state =
    case state.session of
        Nothing ->
            save state

        Just session ->
            save { state | session = Just { session | project = Just project } }


setLocale : String -> State -> Update State msg a
setLocale locale state =
    case state.session of
        Nothing ->
            save state

        Just session ->
            save { state | session = Just { session | locale = locale } }


setCookiesAccepted : Bool -> State -> Update State msg a
setCookiesAccepted accepted state =
    save { state | cookiesAccepted = accepted }


inRouter : In State (Router.State Route) msg a
inRouter =
    inState { get = .router, set = \state router -> { state | router = router } }


inUi : In State Ui.State msg a
inUi =
    inState { get = .ui, set = \state ui -> { state | ui = ui } }


inPage : In State Page msg a
inPage =
    inState { get = .page, set = \state page -> { state | page = page } }


initSession : Flags -> Maybe Session
initSession { session } =
    case Json.decodeString Session.decoder session of
        Ok result ->
            Just result

        _ ->
            Nothing


init : Flags -> Url -> Navigation.Key -> Update State Msg a
init flags url key =
    save State
        |> andMap (initSession flags |> save)
        |> andMap (Router.init fromUrl flags.basePath key RouterMsg)
        |> andMap (Ui.init UiMsg)
        |> andMap (save Nothing)
        |> andMap (save NotFoundPage)
        |> andMap (save False)
        |> andThen (update (RouterMsg (Router.UrlChange url)))
        |> andThen (inUi (Ui.fetchNotifications UiMsg))


redirect : String -> State -> Update State msg a
redirect =
    inRouter << Router.redirect


loadPage : Update Page msg (State -> Update State msg a) -> State -> Update State msg a
loadPage setPage state =
    let
        isLoginRoute =
            always (Just Login == state.router.route)
    in
    state
        |> inPage (always setPage)
        |> andThenIf (not << isLoginRoute) resetRestrictedUrl


sessionRoute : Route -> Session -> Url -> State -> Update State Page.Msg a
sessionRoute route session url =
    case route of
        Login ->
            redirect "/"

        Register ->
            redirect "/"

        ResetPassword ->
            redirect "/"

        Profile ->
            loadPage (fromRoute route)

        Projects ->
            loadPage (fromRoute route)

        NewProject ->
            loadPage (fromRoute route)

        -- These routes require authentication ~and~ a working project
        _ ->
            case session.project of
                Nothing ->
                    redirect "/projects"

                Just project ->
                    loadPage (fromRoute route)


handleRouteChange : Url -> Maybe Route -> State -> Update State Msg a
handleRouteChange url maybeRoute =
    with .session
        (\maybeSession ->
            case ( maybeRoute, maybeSession ) of
                -- No route (404)
                ( Nothing, _ ) ->
                    mapCmd PageMsg << loadPage (save NotFoundPage)

                -- Public routes
                ( Just Logout, _ ) ->
                    setSession Nothing
                        >> andThen (updateSessionStorage Nothing)
                        >> andThen (redirect "/")

                ( Just Login, Nothing ) ->
                    mapCmd PageMsg << loadPage (fromRoute Login)

                ( Just Register, Nothing ) ->
                    mapCmd PageMsg << loadPage (fromRoute Register)

                ( Just ResetPassword, Nothing ) ->
                    mapCmd PageMsg << loadPage (fromRoute ResetPassword)

                -- Everything else requires authentication
                ( _, Nothing ) ->
                    setRestrictedUrl url
                        >> andThen (redirect "/login")

                ( Just route, Just session ) ->
                    mapCmd PageMsg << sessionRoute route session url
        )


updateSessionStorage : Maybe Session -> State -> Update State msg a
updateSessionStorage maybeSession =
    case maybeSession of
        Nothing ->
            addCmd (Ports.clearSession ())

        Just session ->
            addCmd (Ports.setSession session)


returnToRestrictedUrl : State -> Update State Msg a
returnToRestrictedUrl =
    with .restrictedUrl (redirect << Maybe.withDefault "/")


handleAuthResponse : Maybe Session -> State -> Update State Msg a
handleAuthResponse maybeSession =
    let
        authenticated =
            always (Maybe.isJust maybeSession)
    in
    setSession maybeSession
        >> andThen (updateSessionStorage maybeSession)
        >> andThenIf authenticated returnToRestrictedUrl


handleProjectSelected : Project -> State -> Update State Msg a
handleProjectSelected project =
    setWorkingProject project
        >> andThen (with .session updateSessionStorage)
        >> andThen (inUi (Ui.fetchNotifications UiMsg))
        >> andThen (redirect "/")


handleChangeLocale : String -> State -> Update State Msg a
handleChangeLocale locale =
    setLocale locale
        >> andThen (with .session updateSessionStorage)


update : Msg -> State -> Update State Msg a
update msg =
    case msg of
        RouterMsg routerMsg ->
            inRouter (Router.update { onRouteChange = handleRouteChange } routerMsg)

        PageMsg pageMsg ->
            inPage (Page.update { onAuthResponse = handleAuthResponse, onProjectSelected = handleProjectSelected } pageMsg PageMsg)

        UiMsg uiMsg ->
            inUi (Ui.update { onDismissNotification = always save, onChangeLocale = handleChangeLocale } uiMsg UiMsg)

        AcceptCookies ->
            setCookiesAccepted True


subscriptions : State -> Sub Msg
subscriptions { page, ui } =
    Sub.batch
        [ Page.subscriptions page PageMsg
        , Ui.subscriptions ui UiMsg
        ]


view : State -> Document Msg
view ({ page, session, ui, cookiesAccepted } as state) =
    { title = Page.title page
    , body =
        [ Page.view page session ui PageMsg UiMsg
        , Ui.gdprBanner AcceptCookies session cookiesAccepted
        ]
    }
