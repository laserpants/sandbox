module Page.Projects.Select exposing (Msg(..), Search, State, dashboardView, fetchProjects, highlightQuery, inApi, init, projectsTable, projectsView, setSearchQuery, setSearchResults, standaloneView, subscriptions, update)

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
import Ui
import Ui.Spinner exposing (spinner)
import Update.Deep exposing (..)
import Update.Deep.Api as Api exposing (Resource(..))
import Websocket
import Websocket.SearchProjects


type Msg
    = ApiMsg (Api.Msg (List Project))
    | ProjectSearchQuery String
    | WebsocketMsg String
    | SelectProject Project


type alias Search a =
    { query : String
    , results : List a
    }


type alias State =
    { projects : Api.Model (List Project)
    , search : Search Project
    }


setSearchQuery : String -> State -> Update State msg a
setSearchQuery query state =
    let
        { search } =
            state
    in
    save { state | search = { search | query = query } }


setSearchResults : List Project -> State -> Update State msg a
setSearchResults results state =
    let
        { search } =
            state
    in
    save { state | search = { search | results = results } }


inApi : In State (Api.Model (List Project)) msg a
inApi =
    inState { get = .projects, set = \state projects -> { state | projects = projects } }


init : (Msg -> msg) -> Update State msg a
init toMsg =
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
        |> mapCmd toMsg
        |> andThen (fetchProjects toMsg)


fetchProjects : (Msg -> msg) -> State -> Update State msg a
fetchProjects toMsg =
    inApi (Api.sendSimpleRequest (toMsg << ApiMsg))


update : { onProjectSelected : Project -> a } -> Msg -> (Msg -> msg) -> State -> Update State msg a
update { onProjectSelected } msg toMsg =
    case msg of
        ApiMsg apiMsg ->
            inApi (Api.update { onSuccess = always save, onError = always save } apiMsg (toMsg << ApiMsg))

        ProjectSearchQuery query ->
            setSearchQuery query
                >> andAddCmd (Ports.websocketOut (encode 0 (Websocket.SearchProjects.encodeQuery query)))

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

        SelectProject project ->
            applyCallback (onProjectSelected project)


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions state toMsg =
    Ports.websocketIn (toMsg << WebsocketMsg)


highlightQuery : String -> String -> Html msg
highlightQuery query input =
    case query of
        "" ->
            text input

        _ ->
            let
                queryLength =
                    String.length query

                indexes =
                    String.indexes (String.toLower query) (String.toLower input)

                fun ix ( str, strs, prev ) =
                    let
                        wordLength =
                            ix - prev

                        tokenLength =
                            wordLength + queryLength

                        strs_ =
                            String.slice wordLength tokenLength str :: String.left wordLength str :: strs
                    in
                    ( String.dropLeft tokenLength str, strs_, ix + queryLength )

                ( head, tail, _ ) =
                    List.foldl fun ( input, [], 0 ) indexes

                pairs xs =
                    case xs of
                        fst :: snd :: rest ->
                            ( fst, snd ) :: pairs rest

                        fst :: [] ->
                            [ ( fst, "" ) ]

                        _ ->
                            []

                htmlPairs ( slice, query_ ) =
                    [ text slice, b [] [ text query_ ] ]
            in
            span [] (head :: tail |> List.reverse |> pairs |> List.concatMap htmlPairs)


projectsTable : String -> List Project -> (Msg -> msg) -> Html msg
projectsTable searchQuery projects toMsg =
    let
        tableRow project =
            Table.tr []
                [ Table.td []
                    [ Button.button
                        [ Button.roleLink
                        , Button.attrs
                            [ onClick (toMsg (SelectProject project))
                            , Spacing.p0
                            ]
                        ]
                        [ highlightQuery searchQuery project.name
                        ]
                    ]
                , Table.td [] [ text "Today" ]
                , Table.td [] [ text project.country ]
                ]
    in
    if List.isEmpty projects then
        text "No projects found."

    else
        Table.table
            { options = [ Table.attr (class "m-0"), Table.small ]
            , thead =
                Table.simpleThead
                    [ Table.th [ Table.cellAttr (class "w-50") ] [ text "Project name" ]
                    , Table.th [ Table.cellAttr (class "w-40") ] [ text "Last accessed" ]
                    , Table.th [ Table.cellAttr (class "w-10") ] [ text "Country" ]
                    ]
            , tbody = Table.tbody [] (List.map tableRow projects)
            }


projectsView : Api.Model (List Project) -> Search Project -> (Msg -> msg) -> Html msg
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
                projectsTable query items toMsg
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
