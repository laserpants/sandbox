module Page.User.Profile exposing (Msg(..), State, dashboardView, inForm, init, standaloneView, subscriptions, update)

import Bootstrap.Utilities.Spacing as Spacing
import Form.User.Profile
import Helpers.Form exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Ui
import Update.Deep exposing (..)
import Update.Deep.Form as Form


type Msg
    = FormMsg Form.Msg


type alias State =
    { formModel : Form.Model CustomError Form.User.Profile.Fields
    }


inForm : In State (Form.Model CustomError Form.User.Profile.Fields) msg a
inForm =
    inState { get = .formModel, set = \state form -> { state | formModel = form } }


init : (Msg -> msg) -> Update State msg a
init toMsg =
    save State
        |> andMap (Form.init [] Form.User.Profile.validate)
        |> mapCmd toMsg


update : Msg -> (Msg -> msg) -> State -> Update State msg a
update msg toMsg state =
    save state


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions state toMsg =
    Sub.none


page : State -> (Msg -> msg) -> Html msg
page { formModel } toMsg =
    let
        { form, disabled } =
            formModel
    in
    div [] [ Form.User.Profile.view form disabled (toMsg << FormMsg) ]


standaloneView : State -> (Msg -> msg) -> Html msg
standaloneView state toMsg =
    div [ Spacing.p5 ]
        [ div [ class "text-center" ]
            [ h2 [ Spacing.mb4, class "text-gray-900" ] [ text "User profile" ]
            ]
        , page state toMsg
        ]


dashboardView : State -> (Msg -> msg) -> Html msg
dashboardView state toMsg =
    Ui.card "User profile"
        [ page state toMsg
        ]
