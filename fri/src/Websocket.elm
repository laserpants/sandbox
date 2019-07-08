module Websocket exposing (Message(..), Search, messageDecoder, setSearchQuery, setSearchResults)

import Data.Campaign as Campaign exposing (Campaign)
import Data.Content.Audio as Audio exposing (Audio)
import Data.Content.Text as Text exposing (Text)
import Data.Listener as Listener exposing (Listener)
import Data.ListenerAudio as ListenerAudio exposing (ListenerAudio)
import Data.Project as Project exposing (Project)
import Json.Decode as Json
import Update.Deep exposing (..)
import Websocket.LoginAvailable
import Websocket.Search


type alias Search a =
    Websocket.Search.Results a


type alias SearchState a b c =
    { b | search : { c | results : List a, query : String } }


setSearchQuery : String -> SearchState a b c -> Update (SearchState a b c) msg d
setSearchQuery query state =
    let
        { search } =
            state
    in
    save { state | search = { search | query = query } }


setSearchResults : List a -> SearchState a b c -> Update (SearchState a b c) msg d
setSearchResults results state =
    let
        { search } =
            state
    in
    save { state | search = { search | results = results } }


type Message
    = LoginIsAvailableResponse Websocket.LoginAvailable.Message
    | SearchProjectsResults (Websocket.Search.Results Project)
    | SearchCampaignsResults (Websocket.Search.Results Campaign)
    | SearchAudienceResults (Websocket.Search.Results Listener)
    | SearchAudioContentResults (Websocket.Search.Results Audio)
    | SearchTextContentResults (Websocket.Search.Results Audio)
    | SearchListenerAudioResults (Websocket.Search.Results ListenerAudio)


messageDecoder : Json.Decoder Message
messageDecoder =
    let
        payloadDecoder type_ =
            case type_ of
                "login_available_response" ->
                    Json.map LoginIsAvailableResponse Websocket.LoginAvailable.decoder

                "projects_search_response" ->
                    Json.map SearchProjectsResults (Websocket.Search.decoder Project.decoder)

                "campaigns_search_response" ->
                    Json.map SearchCampaignsResults (Websocket.Search.decoder Campaign.decoder)

                "audience_search_response" ->
                    Json.map SearchAudienceResults (Websocket.Search.decoder Listener.decoder)

                "audio_content_search_response" ->
                    Json.map SearchAudioContentResults (Websocket.Search.decoder Audio.decoder)

                "text_content_search_response" ->
                    Json.map SearchTextContentResults (Websocket.Search.decoder Text.decoder)

                "listener_audio_search_response" ->
                    Json.map SearchListenerAudioResults (Websocket.Search.decoder ListenerAudio.decoder)

                _ ->
                    Json.fail "Unrecognized message type"
    in
    Json.field "type" Json.string |> Json.andThen payloadDecoder
