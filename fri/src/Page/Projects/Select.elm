module Page.Projects.Select exposing (Msg(..), State, dashboardView, fetchProjects, inApi, init, projectsView, standaloneView, subscriptions, update)

import Bootstrap.Alert as Alert
import Bootstrap.Button as Button
import Bootstrap.Form.Input as Input
import Bootstrap.Table as Table
import Bootstrap.Utilities.Spacing as Spacing
import Data.Project as Project exposing (Project)
import Helpers.Api exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Json.Encode exposing (encode)
import Ports
import Table.Projects
import Ui
import Ui.Spinner exposing (spinner)
import Update.Deep exposing (..)
import Update.Deep.Api as Api exposing (Resource(..), sendSimpleRequest)
import Websocket exposing (setSearchQuery, setSearchResults)
import Websocket.Search


type Msg
    = ApiMsg (Api.Msg (List Project))
    | ProjectSearchQuery String
    | WebsocketMsg String
    | Select Project


type alias State =
    { projects : Api.Model (List Project)
    , search : Websocket.Search Project
    }


inApi : Wrap State Msg (Api.Model (List Project)) (Api.Msg (List Project)) a
inApi =
    wrapState
        { get = .projects
        , set = \state projects -> { state | projects = projects }
        , msg = ApiMsg
        }


init : Update State Msg a
init =
    let
        projects =
            Api.init
                { endpoint = "/projects"
                , method = Api.HttpGet
                , decoder = Json.field "projects" (Json.list Project.decoder)
                }
    in
    save State
        |> andMap projects
        |> andMap (save { query = "", results = [] })
        |> andThen fetchProjects


fetchProjects : State -> Update State Msg a
fetchProjects =
    inApi sendSimpleRequest


update : { onProjectSelected : Project -> a } -> Msg -> State -> Update State Msg a
update { onProjectSelected } msg =
    case msg of
        ApiMsg apiMsg ->
            inApi (Api.update { onSuccess = always save, onError = always save } apiMsg)

        ProjectSearchQuery query ->
            setSearchQuery query
                >> andAddCmd (Ports.websocketOut (encode 0 (Websocket.Search.encodeSearchQuery "projects" query)))

        WebsocketMsg websocketMsg ->
            case Json.decodeString Websocket.messageDecoder websocketMsg of
                Ok (Websocket.SearchProjectsResults { query, results }) ->
                    with .search
                        (\search ->
                            if query == search.query then
                                setSearchResults results

                            else
                                save
                        )

                _ ->
                    save

        Select project ->
            applyCallback (onProjectSelected project)


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions state toMsg =
    Ports.websocketIn (toMsg << WebsocketMsg)


projectsView : Api.Model (List Project) -> Websocket.Search Project -> (Msg -> msg) -> Html msg
projectsView { resource } { query, results } toMsg =
    div [ style "min-height" "200px" ]
        [ case resource of
            NotRequested ->
                text ""

            Requested ->
                spinner

            Error httpError ->
                resourceErrorMessage resource

            Available projects ->
                let
                    items =
                        if String.isEmpty query then
                            projects

                        else
                            results
                in
                Table.Projects.view query items Select toMsg
        ]


page : State -> (Msg -> msg) -> Html msg
page { projects, search } toMsg =
    div []
        [ p [] [ text "Type the name of the project you’d like to access in the input field below, or select a recently used project." ]
        , div [ Spacing.mb4 ]
            [ Input.text
                [ Input.placeholder "Type the name of a project here"
                , Input.value search.query
                , Input.onInput (toMsg << ProjectSearchQuery)
                ]
            ]
        , Alert.simpleInfo [ Spacing.mb4 ] [ text "If you can’t find the project you’re looking for, ask an administrator for access." ]
        , projectsView projects search toMsg
        , Button.linkButton
            [ Button.small
            , Button.block
            , Button.primary
            , Button.attrs
                [ href "/projects/new" ]
            ]
            [ text "Create a new project" ]
        ]


standaloneView : State -> (Msg -> msg) -> Html msg
standaloneView state toMsg =
    div [ Spacing.p5 ]
        [ div [ class "text-center" ]
            [ i [ style "font-size" "64px", class "fas fa-comments", class "mb-3" ] []
            , h2 [ Spacing.mb4, class "text-gray-900" ] [ text "Choose your project" ]
            ]
        , page state toMsg
        , hr [] []
        , div [ class "text-center" ]
            [ a [ href "/profile" ] [ text "Profile" ]
            , span [ class "mx-2" ] [ text "|" ]
            , a [ href "/logout" ] [ text "Log out" ]
            ]
        ]


dashboardView : State -> (Msg -> msg) -> Html msg
dashboardView state toMsg =
    Ui.card "Select a project"
        [ page state toMsg
        ]
