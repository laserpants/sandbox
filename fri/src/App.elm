module App exposing (Flags, Msg(..), State, init, subscriptions, update, view)

import Browser exposing (Document)
import Browser.Navigation as Navigation
import Data.Project exposing (Project)
import Data.Session as Session exposing (Session)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Maybe exposing (withDefault)
import Maybe.Extra as Maybe
import Page exposing (..)
import Ports
import Route exposing (Route(..), fromUrl)
import Ui exposing (fetchNotifications)
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


inRouter : Wrap State Msg (Router.State Route) Router.Msg a
inRouter =
    Router.component RouterMsg


inUi : Wrap State Msg Ui.State Ui.Msg a
inUi =
    Ui.component UiMsg


inPage : Wrap State Msg Page Page.Msg a
inPage =
    Page.component PageMsg


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
        |> andMap (Router.init fromUrl flags.basePath key)
        |> andMap Ui.init
        |> andMap (save Nothing)
        |> andMap (save NotFoundPage)
        |> andMap (save False)
        |> andThen (update (RouterMsg (Router.UrlChange url)))
        |> andThen (inUi fetchNotifications)


redirect : String -> State -> Update State Msg a
redirect =
    inRouter << Router.redirect


loadPage : Update Page Page.Msg (State -> Update State Msg a) -> State -> Update State Msg a
loadPage setPage state =
    let
        isLoginRoute =
            Just Login == state.router.route
    in
    state
        |> inPage (always setPage)
        |> andWhen (not isLoginRoute) resetRestrictedUrl


sessionRoute : Route -> Session -> Url -> State -> Update State Msg a
sessionRoute route session url =
    case route of
        Login ->
            redirect "/"

        Register ->
            redirect "/"

        ResetPassword ->
            redirect "/"

        Profile ->
            loadPage (fromRoute route url)

        Projects ->
            loadPage (fromRoute route url)

        NewProject ->
            loadPage (fromRoute route url)

        -- These routes require authentication ~and~ a working project
        _ ->
            case session.project of
                Nothing ->
                    redirect "/projects"

                Just project ->
                    loadPage (fromRoute route url)


handleRouteChange : Url -> Maybe Route -> State -> Update State Msg a
handleRouteChange url maybeRoute =
    with .session
        (\maybeSession ->
            case ( maybeRoute, maybeSession ) of
                -- No route (404)
                ( Nothing, _ ) ->
                    loadPage (save NotFoundPage)

                -- Public routes
                ( Just Logout, _ ) ->
                    setSession Nothing
                        >> andThen (updateSessionStorage Nothing)
                        >> andThen (redirect "/")

                ( Just Login, Nothing ) ->
                    loadPage (fromRoute Login url)

                ( Just Register, Nothing ) ->
                    loadPage (fromRoute Register url)

                ( Just ResetPassword, Nothing ) ->
                    loadPage (fromRoute ResetPassword url)

                -- Everything else requires authentication
                ( _, Nothing ) ->
                    setRestrictedUrl url
                        >> andThen (redirect "/login")

                ( Just route, Just session ) ->
                    sessionRoute route session url
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
    with .restrictedUrl (redirect << withDefault "/")


handleAuthResponse : Maybe Session -> State -> Update State Msg a
handleAuthResponse maybeSession =
    let
        authenticated =
            Maybe.isJust maybeSession
    in
    setSession maybeSession
        >> andThen (updateSessionStorage maybeSession)
        >> andWhen authenticated returnToRestrictedUrl


handleProjectSelected : Project -> State -> Update State Msg a
handleProjectSelected project =
    setWorkingProject project
        >> andThen (with .session updateSessionStorage)
        >> andThen (inUi fetchNotifications)
        >> andThen (redirect "/")


handleChangeLocale : String -> State -> Update State Msg a
handleChangeLocale locale =
    setLocale locale
        >> andThen (with .session updateSessionStorage)


update : Msg -> State -> Update State Msg a
update msg =
    case msg of
        RouterMsg routerMsg ->
            let
                callbacks =
                    { onRouteChange = handleRouteChange
                    }
            in
            inRouter (Router.update callbacks routerMsg)

        PageMsg pageMsg ->
            let
                callbacks =
                    { onAuthResponse = handleAuthResponse
                    , onProjectSelected = handleProjectSelected
                    }
            in
            inPage (Page.update callbacks pageMsg)

        UiMsg uiMsg ->
            let
                callbacks =
                    { onDismissNotification = always save
                    , onChangeLocale = handleChangeLocale
                    }
            in
            inUi (Ui.update callbacks uiMsg)

        AcceptCookies ->
            setCookiesAccepted True


subscriptions : State -> Sub Msg
subscriptions { page, ui } =
    Sub.batch
        [ Page.subscriptions page PageMsg
        , Ui.subscriptions ui UiMsg
        ]


view : State -> Document Msg
view { page, session, ui, cookiesAccepted } =
    let
        uiLayout =
            Ui.layout ui UiMsg

        dashboardLayout user project locale =
            Ui.dashboardLayout ui user project locale UiMsg
    in
    { title = Page.title page
    , body =
        [ Page.view page session uiLayout dashboardLayout PageMsg
        , Ui.gdprBanner AcceptCookies session cookiesAccepted
        ]
    }
