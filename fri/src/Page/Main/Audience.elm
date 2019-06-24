module Page.Main.Audience exposing (Msg(..), State, init, subscriptions, update, view)

import Bootstrap.Form.Input as Input
import Bootstrap.Utilities.Spacing as Spacing
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Table.Audience
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
    Ui.card "Audience"
        [ h6 [] [ b [] [ text "Search audience" ] ]
        , Input.text
            [ Input.attrs [ Spacing.mb4 ]
            , Input.placeholder "Type a name or phone number"
            ]
        , h6 [] [ text "Showing results 1 to 3" ]
        , Table.Audience.view
        ]
