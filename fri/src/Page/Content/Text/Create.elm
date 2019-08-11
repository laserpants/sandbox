module Page.Content.Text.Create exposing (Msg(..), State, init, subscriptions, update, view)

import Form as F exposing (InputType(..))
import Form.Content.Text.Create
import Form.Field exposing (FieldValue(..))
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Ui
import Ui.TagInput
import Update.Deep exposing (..)
import Update.Deep.Form as Form


type Msg
    = FormMsg Form.Msg
    | TagMsg Ui.TagInput.Msg


type alias State =
    { formModel : Form.Model Never Form.Content.Text.Create.Fields
    , tags : Ui.TagInput.State
    }


inForm : Wrap State Msg (Form.Model Never Form.Content.Text.Create.Fields) Form.Msg a
inForm =
    Form.component FormMsg


inTags : Wrap State Msg Ui.TagInput.State Ui.TagInput.Msg a
inTags =
    Ui.TagInput.component TagMsg


init : Update State msg a
init =
    save State
        |> andMap (Form.init [] Form.Content.Text.Create.validate)
        |> andMap Ui.TagInput.init


handleTagFieldChange : List String -> State -> Update State Msg a
handleTagFieldChange tags =
    let
        value =
            tags
                |> List.intersperse ";"
                |> String.concat
                |> String
    in
    inForm (Form.formInput "tags" Text value)


update : Msg -> State -> Update State Msg a
update msg =
    case msg of
        FormMsg formMsg ->
            inForm (Form.update { onSubmit = \f -> Debug.log (Debug.toString f) save } formMsg)

        TagMsg tagMsg ->
            inTags (Ui.TagInput.update { onChange = handleTagFieldChange } tagMsg)


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions state toMsg =
    Sub.none


view : State -> (Msg -> msg) -> Html msg
view { formModel, tags } toMsg =
    let
        { form, disabled } =
            formModel

        tagInput =
            Ui.TagInput.tagInput tags (toMsg << TagMsg)
    in
    Ui.card "Create new text message"
        [ Form.Content.Text.Create.view tagInput form disabled (toMsg << FormMsg)
        ]
