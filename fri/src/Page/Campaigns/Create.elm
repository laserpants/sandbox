module Page.Campaigns.Create exposing (Msg(..), State, init, subscriptions, update, view)

import Form.Campaigns.Create
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Ui
import Update.Deep exposing (..)
import Update.Deep.Form as Form


type Msg
    = FormMsg Form.Msg


type alias State =
    { formModel : Form.Model Never Form.Campaigns.Create.Fields
    }


inForm : Wrap State Msg (Form.Model Never Form.Campaigns.Create.Fields) Form.Msg a
inForm =
    Form.component FormMsg


init : Update State msg a
init =
    save State
        |> andMap (Form.init [] Form.Campaigns.Create.validate)


update : Msg -> State -> Update State Msg a
update msg =
    case msg of
        FormMsg formMsg ->
            inForm (Form.update { onSubmit = always save } formMsg)


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions state toMsg =
    Sub.none


view : State -> (Msg -> msg) -> Html msg
view { formModel } toMsg =
    let
        { form, disabled } =
            formModel
    in
    Ui.card "Create new campaign"
        [ Form.Campaigns.Create.view form disabled (toMsg << FormMsg)
        ]
