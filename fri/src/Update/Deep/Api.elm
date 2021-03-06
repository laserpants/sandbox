module Update.Deep.Api exposing (ApiEventHandlers, HttpMethod(..), Model, Msg(..), Request, RequestConfig, Resource(..), component, init, resetResource, sendRequest, sendSimpleRequest, setResource, update)

import Http exposing (emptyBody)
import Json.Decode as Json
import Update.Deep exposing (..)


type Msg a
    = Response (Result Http.Error a)
    | Reset


type Resource a
    = NotRequested
    | Requested
    | Error Http.Error
    | Available a


type alias Request a =
    String -> Maybe Http.Body -> Cmd (Msg a)


type alias Model a =
    { resource : Resource a
    , request : Request a
    }


component : (Msg c -> msg) -> Wrap { b | api : Model c } msg (Model c) (Msg c) a
component msg =
    wrapState
        { get = .api
        , set = \state api -> { state | api = api }
        , msg = msg
        }


setResource : Resource a -> Model a -> Update (Model a) msg b
setResource resource state =
    save { state | resource = resource }


type HttpMethod
    = HttpGet
    | HttpPost
    | HttpPut


type alias RequestConfig a =
    { endpoint : String
    , method : HttpMethod
    , decoder : Json.Decoder a
    }


init : RequestConfig a -> Update (Model a) msg b
init { endpoint, method, decoder } =
    let
        expect =
            Http.expectJson Response decoder

        request suffix body =
            Http.request
                { method =
                    case method of
                        HttpGet ->
                            "GET"

                        HttpPost ->
                            "POST"

                        HttpPut ->
                            "PUT"
                , headers = []
                , url = endpoint ++ suffix
                , expect = expect
                , body = Maybe.withDefault emptyBody body
                , timeout = Nothing
                , tracker = Nothing
                }
    in
    save { resource = NotRequested, request = request }


sendRequest : String -> Maybe Http.Body -> Model a -> Update (Model a) (Msg a) b
sendRequest url maybeBody model =
    model
        |> setResource Requested
        |> andAddCmd (model.request url maybeBody)


sendSimpleRequest : Model a -> Update (Model a) (Msg a) b
sendSimpleRequest =
    sendRequest "" Nothing


resetResource : Model a -> Update (Model a) msg b
resetResource =
    setResource NotRequested


type alias ApiEventHandlers a b =
    { onSuccess : a -> b
    , onError : Http.Error -> b
    }


update : ApiEventHandlers a b -> Msg a -> Model a -> Update (Model a) (Msg a) b
update { onSuccess, onError } msg =
    case msg of
        Response (Ok resource) ->
            setResource (Available resource)
                >> andApplyCallback (onSuccess resource)

        Response (Err error) ->
            setResource (Error error)
                >> andApplyCallback (onError error)

        Reset ->
            resetResource
