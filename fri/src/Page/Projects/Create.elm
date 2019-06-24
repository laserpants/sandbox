module Page.Projects.Create exposing (Msg(..), State, dashboardView, inForm, init, standaloneView, subscriptions, update)

import Bootstrap.Card as Card
import Bootstrap.Card.Block as Block
import Bootstrap.Utilities.Spacing as Spacing
import Form.Field as Field exposing (FieldValue(..))
import Form.Projects.Create
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Ui
import Update.Deep exposing (..)
import Update.Deep.Form as Form


type Msg
    = FormMsg Form.Msg
    | Cancel


type alias State =
    { formModel : Form.Model Never Form.Projects.Create.Fields
    }


inForm : In State (Form.Model Never Form.Projects.Create.Fields) msg a
inForm =
    inState { get = .formModel, set = \state form -> { state | formModel = form } }


init : (Msg -> msg) -> Update State msg a
init toMsg =
    save State
        |> andMap (Form.init [] Form.Projects.Create.validate)
        |> mapCmd toMsg


update : Msg -> (Msg -> msg) -> State -> Update State msg a
update msg toMsg =
    case msg of
        FormMsg formMsg ->
            inForm (Form.update { onSubmit = always save } formMsg)

        Cancel ->
            save


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions state toMsg =
    Sub.none


page : State -> (Msg -> msg) -> Html msg
page { formModel } toMsg =
    let
        { form, disabled } =
            formModel
    in
    Form.Projects.Create.view form disabled (toMsg << FormMsg)


standaloneView : State -> (Msg -> msg) -> Html msg
standaloneView state toMsg =
    div [ Spacing.p5 ]
        [ div [ class "text-center" ]
            [ i [ style "font-size" "64px", class "fas fa-comments", class "mb-3" ] []
            , h2 [ Spacing.mb4, class "text-gray-900" ] [ text "New project" ]
            ]
        , page state toMsg
        ]


dashboardView : State -> (Msg -> msg) -> Html msg
dashboardView state toMsg =
    Ui.card "New project"
        [ page state toMsg
        ]
