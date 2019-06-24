module Page.Results.Answers exposing (Msg(..), State, init, subscriptions, update, view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Ui
import Update.Deep exposing (..)


type Msg
    = NoMsg


type alias State =
    {}


init : (Msg -> msg) -> Update State msg a
init toMsg =
    save {}


update : Msg -> (Msg -> msg) -> State -> Update State msg a
update msg toMsg state =
    save state


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions state toMsg =
    Sub.none


view : State -> (Msg -> msg) -> Html msg
view state toMsg =
    Ui.card "Answers"
        [ text "here"
        ]
