module Update.Deep.Pagination exposing (Envelope, Msg(..), State, component, fetchPage, goto, inApi, init, next, previous, setCurrent, setLimit, setStates, update)

import Json.Decode as Json
import Update.Deep exposing (..)
import Update.Deep.Api as Api exposing (Resource(..))


type alias Envelope item =
    { page : List item
    , total : Int
    }


decoder : String -> Json.Decoder item -> Json.Decoder (Envelope item)
decoder key itemDecoder =
    Json.map2 Envelope
        (Json.field key (Json.list itemDecoder))
        (Json.field "total" Json.int)


type Msg item
    = ApiMsg (Api.Msg (Envelope item))
    | Next
    | Previous
    | Goto Int


type alias State item =
    { api : Api.Model (Envelope item)
    , current : Int
    , pages : Int
    , limit : Int
    }


component : (Msg item -> msg) -> Wrap { b | page : State item } msg (State item) (Msg item) a
component msg =
    wrapState
        { get = .page
        , set = \state page -> { state | page = page }
        , msg = msg
        }


setCurrent : Int -> State item -> Update (State item) msg a
setCurrent page state =
    save { state | current = page }


setStates : Int -> State item -> Update (State item) msg a
setStates pages state =
    save { state | pages = pages }


setLimit : Int -> State item -> Update (State item) msg a
setLimit limit state =
    save { state | limit = limit }


inApi : Wrap (State item) (Msg item) (Api.Model (Envelope item)) (Api.Msg (Envelope item)) a
inApi =
    Api.component ApiMsg


fetchPage : State item -> Update (State item) (Msg item) a
fetchPage =
    with .limit
        (\limit ->
            with .current
                (\current ->
                    let
                        offset =
                            limit * (current - 1)

                        queryString =
                            "?offset=" ++ String.fromInt offset ++ "&limit=" ++ String.fromInt limit
                    in
                    inApi (Api.sendRequest queryString Nothing)
                )
        )


goto : Int -> State item -> Update (State item) (Msg item) a
goto page =
    setCurrent page >> andThen fetchPage


next : State item -> Update (State item) (Msg item) a
next =
    with .current (\current -> goto (current + 1))


previous : State item -> Update (State item) (Msg item) a
previous =
    with .current (\current -> goto (max 1 (current - 1)))


init : { limit : Int, endpoint : String, field : String, itemDecoder : Json.Decoder item } -> Update (State item) (Msg item) a
init { limit, endpoint, field, itemDecoder } =
    let
        api =
            Api.init
                { endpoint = endpoint
                , method = Api.HttpGet
                , decoder = decoder field itemDecoder
                }
    in
    save State
        |> andMap api
        |> andMap (save 1)
        |> andMap (save 0)
        |> andMap (save limit)


updateCurrentPage : Envelope item -> State item -> Update (State item) msg a
updateCurrentPage { total } =
    with .limit
        (\limit ->
            let
                pages =
                    (total + limit - 1) // limit
            in
            setStates pages
                >> andThen
                    (with .current
                        (\current ->
                            setCurrent (clamp 1 pages current)
                        )
                    )
        )


update : Msg item -> State item -> Update (State item) (Msg item) a
update msg =
    case msg of
        ApiMsg apiMsg ->
            inApi (Api.update { onSuccess = updateCurrentPage, onError = always save } apiMsg)

        Next ->
            next

        Previous ->
            previous

        Goto page ->
            goto page
