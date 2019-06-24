module Websocket exposing (Message(..), messageDecoder)

import Json.Decode as Json
import Websocket.LoginAvailable
import Websocket.SearchProjects


type Message
    = LoginIsAvailableResponse Websocket.LoginAvailable.Message
    | SearchProjectsResults Websocket.SearchProjects.Message


messageDecoder : Json.Decoder Message
messageDecoder =
    let
        payloadDecoder type_ =
            case type_ of
                "login_available_response" ->
                    Json.map LoginIsAvailableResponse Websocket.LoginAvailable.decoder

                "projects_search_response" ->
                    Json.map SearchProjectsResults Websocket.SearchProjects.decoder

                _ ->
                    Json.fail "Unrecognized message type"
    in
    Json.field "type" Json.string |> Json.andThen payloadDecoder
