module Page.Main.ListenerAudio exposing (Msg(..), State, init, subscriptions, update, view)

import Bootstrap.Form.Input as Input
import Bootstrap.Utilities.Spacing as Spacing
import Data.ListenerAudio as ListenerAudio exposing (ListenerAudio)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Json.Encode exposing (encode)
import Ports
import Table.ListenerAudio
import Ui
import Ui.Pagination
import Update.Deep exposing (..)
import Update.Deep.Pagination as Pagination exposing (fetchPage)
import Websocket exposing (setSearchQuery, setSearchResults)
import Websocket.Search


type Msg
    = PaginationMsg (Pagination.Msg ListenerAudio)
    | ListenerAudioSearchQuery String
    | WebsocketMsg String


type alias State =
    { page : Pagination.State ListenerAudio
    , search : Websocket.Search ListenerAudio
    }


inPagination : Wrap State Msg (Pagination.State ListenerAudio) (Pagination.Msg ListenerAudio) a
inPagination =
    Pagination.component PaginationMsg


init : Update State Msg a
init =
    let
        page =
            Pagination.init
                { limit = 2
                , endpoint = "/listener-audio"
                , field = "listenerAudio"
                , itemDecoder = ListenerAudio.decoder
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

        ListenerAudioSearchQuery query ->
            setSearchQuery query
                >> andAddCmd (Ports.websocketOut (encode 0 (Websocket.Search.encodeSearchQuery "listener_audio" query)))

        WebsocketMsg websocketMsg ->
            case Json.decodeString Websocket.messageDecoder websocketMsg of
                Ok (Websocket.SearchListenerAudioResults { query, results }) ->
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
view { search, page } toMsg =
    Ui.card "Listener audio"
        [ h6 [] [ b [] [ text "Search listener audio" ] ]
        , Input.text
            [ Input.attrs [ Spacing.mb4 ]
            , Input.placeholder "Type a phone number or ?" --TODO
            , Input.onInput (toMsg << ListenerAudioSearchQuery)
            ]
        , Ui.Pagination.table page search Table.ListenerAudio.view (toMsg << PaginationMsg)
        ]
