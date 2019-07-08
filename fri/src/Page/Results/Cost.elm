module Page.Results.Cost exposing (Msg(..), State, init, subscriptions, update, view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Update.Deep exposing (..)


type Msg
    = NoMsg


type alias State =
    {}


init : Update State msg a
init =
    save {}


update : Msg -> State -> Update State msg a
update msg state =
    save state


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions state toMsg =
    Sub.none


view : State -> (Msg -> msg) -> Html msg
view state toMsg =
    div [] []
