module Page.Content.Text.Archive exposing (Msg(..), State, init, subscriptions, update, view)

import Bootstrap.Form.Input as Input
import Bootstrap.Utilities.Spacing as Spacing
import Data.Content.Text as Text exposing (Text)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Json.Encode exposing (encode)
import Ports
import Table.Content.Text
import Ui
import Ui.Pagination
import Update.Deep exposing (..)
import Update.Deep.Pagination as Pagination exposing (fetchPage)
import Websocket exposing (setSearchQuery, setSearchResults)
import Websocket.Search


type Msg
    = PaginationMsg (Pagination.Msg Text)
    | TextContentSearchQuery String
    | WebsocketMsg String


type alias State =
    { page : Pagination.State Text
    , search : Websocket.Search Text
    }


inPagination : Wrap State Msg (Pagination.State Text) (Pagination.Msg Text) a
inPagination =
    Pagination.component PaginationMsg


init : Update State Msg a
init =
    let
        page =
            Pagination.init
                { limit = 2
                , endpoint = "/content/text"
                , field = "text"
                , itemDecoder = Text.decoder
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

        TextContentSearchQuery query ->
            setSearchQuery query
                >> andAddCmd (Ports.websocketOut (encode 0 (Websocket.Search.encodeSearchQuery "text_content" query)))

        WebsocketMsg websocketMsg ->
            case Json.decodeString Websocket.messageDecoder websocketMsg of
                Ok (Websocket.SearchTextContentResults { query, results }) ->
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
    Ui.card "Text message content"
        [ h6 [] [ b [] [ text "Search messages" ] ]
        , Input.text
            [ Input.attrs [ Spacing.mb4 ]
            , Input.placeholder "Search for text message"
            , Input.onInput (toMsg << TextContentSearchQuery)
            ]
        , Ui.Pagination.table page search Table.Content.Text.view (toMsg << PaginationMsg)
        ]
