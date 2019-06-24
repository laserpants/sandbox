module Page.Campaigns.All exposing (Msg(..), State, init, subscriptions, update, view)

import Bootstrap.Form.Input as Input
import Bootstrap.Utilities.Spacing as Spacing
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Table.Campaigns
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
    Ui.card "All campaigns"
        [ h6 [] [ b [] [ text "Search campaigns" ] ]
        , Input.text
            [ Input.attrs [ Spacing.mb4 ]
            , Input.placeholder "Type the name of a campaign"
            ]
        , h6 [] [ text "Showing results 1 to 3" ]
        , Table.Campaigns.view
        ]
