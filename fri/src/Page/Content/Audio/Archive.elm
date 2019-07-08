module Page.Content.Audio.Archive exposing (Msg(..), State, init, subscriptions, update, view)

import Bootstrap.Form.Input as Input
import Bootstrap.Utilities.Spacing as Spacing
import Data.Content.Audio as Audio exposing (Audio)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Json.Encode exposing (encode)
import Ports
import Table.Content.Audio
import Ui
import Ui.Pagination
import Update.Deep exposing (..)
import Update.Deep.Pagination as Pagination exposing (fetchPage)
import Websocket exposing (setSearchQuery, setSearchResults)
import Websocket.Search


type Msg
    = PaginationMsg (Pagination.Msg Audio)
    | AudioContentSearchQuery String
    | WebsocketMsg String


type alias State =
    { page : Pagination.State Audio
    , search : Websocket.Search Audio
    }


inPagination : Wrap State Msg (Pagination.State Audio) (Pagination.Msg Audio) a
inPagination =
    Pagination.component PaginationMsg


init : Update State Msg a
init =
    let
        page =
            Pagination.init
                { limit = 2
                , endpoint = "/content/audio"
                , field = "audio"
                , itemDecoder = Audio.decoder
                }
    in
    save State
        |> andMap (page |> mapCmd PaginationMsg)
        |> andMap (save Websocket.Search.initial)
        |> andThen (inPagination fetchPage)


update : Msg -> State -> Update State Msg a
update msg =
    case msg of
        PaginationMsg pageMsg ->
            inPagination (Pagination.update pageMsg)

        AudioContentSearchQuery query ->
            setSearchQuery query
                >> andAddCmd (Ports.websocketOut (encode 0 (Websocket.Search.encodeSearchQuery "audio_content" query)))

        WebsocketMsg websocketMsg ->
            case Json.decodeString Websocket.messageDecoder websocketMsg of
                Ok (Websocket.SearchAudioContentResults { query, results }) ->
                    with .search
                        (\search ->
                            if query == search.query then
                                setSearchResults results

                            else
                                save
                        )

                _ ->
                    save


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions state toMsg =
    Ports.websocketIn (toMsg << WebsocketMsg)


view : State -> (Msg -> msg) -> Html msg
view { page, search } toMsg =
    Ui.card "Audio archive"
        [ h6 [] [ b [] [ text "Search audience" ] ]
        , Input.text
            [ Input.attrs [ Spacing.mb4 ]
            , Input.placeholder "Search for audio"
            , Input.onInput (toMsg << AudioContentSearchQuery)
            ]
        , Ui.Pagination.table page search Table.Content.Audio.view (toMsg << PaginationMsg)
        ]
