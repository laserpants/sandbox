module Page.Content.Audio.Upload exposing (Msg(..), State, init, subscriptions, update, view)

import Bootstrap.Progress as Progress
import Bootstrap.Table as Table
import Data.Content.Audio as Audio exposing (Audio)
import File
import Filesize
import Form as F exposing (InputType(..))
import Form.Content.Audio.Create
import Form.Field exposing (FieldValue(..))
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json exposing (field)
import Ui
import Ui.TagInput
import Update.Deep exposing (..)
import Update.Deep.Api as Api
import Update.Deep.Form as Form
import Update.Deep.Upload as Upload exposing (Status(..))


type Msg
    = UploadMsg Upload.Msg
    | FormMsg Form.Msg
    | TagMsg Ui.TagInput.Msg
    | ApiMsg (Api.Msg Audio)


type alias State =
    { upload : Upload.State
    , formModel : Form.Model Never Form.Content.Audio.Create.Fields
    , tags : Ui.TagInput.State
    , api : Api.Model Audio
    }


inUpload : Wrap State Msg Upload.State Upload.Msg a
inUpload =
    Upload.component UploadMsg


inForm : Wrap State Msg (Form.Model Never Form.Content.Audio.Create.Fields) Form.Msg a
inForm =
    Form.component FormMsg


inTags : Wrap State Msg Ui.TagInput.State Ui.TagInput.Msg a
inTags =
    Ui.TagInput.component TagMsg


inApi : Wrap State Msg (Api.Model Audio) (Api.Msg Audio) a
inApi =
    Api.component ApiMsg


init : Update State msg a
init =
    let
        upload =
            Upload.init
                { url = "/content/audio/upload"
                , headers = []
                }

        api =
            Api.init
                { endpoint = "/content/audio"
                , method = Api.HttpPost
                , decoder = field "audio" Audio.decoder
                }
    in
    save State
        |> andMap upload
        |> andMap (Form.init [] Form.Content.Audio.Create.validate)
        |> andMap Ui.TagInput.init
        |> andMap api


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
        UploadMsg uploadMsg ->
            inUpload (Upload.update uploadMsg)

        FormMsg formMsg ->
            inForm (Form.update { onSubmit = always save } formMsg)

        TagMsg tagMsg ->
            inTags (Ui.TagInput.update { onChange = handleTagFieldChange } tagMsg)

        ApiMsg apiMsg ->
            inApi (Api.update { onSuccess = always save, onError = always save } apiMsg)


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions { upload } toMsg =
    Upload.subscriptions upload (toMsg << UploadMsg)


view : State -> (Msg -> msg) -> Html msg
view { upload, formModel, tags } toMsg =
    let
        { form, disabled } =
            formModel

        fileInfo file =
            Table.table
                { options = [ Table.bordered, Table.small ]
                , thead =
                    Table.simpleThead []
                , tbody =
                    Table.tbody []
                        [ Table.tr []
                            [ Table.td [] [ text "Filename" ]
                            , Table.td [] [ text (File.name file) ]
                            ]
                        , Table.tr []
                            [ Table.td [] [ text "Media (MIME) type" ]
                            , Table.td [] [ text (File.mime file) ]
                            ]
                        , Table.tr []
                            [ Table.td [] [ text "Size" ]
                            , Table.td [] [ text (File.size file |> Filesize.format) ]
                            ]
                        ]
                }

        tagInput =
            Ui.TagInput.tagInput tags (toMsg << TagMsg)
    in
    Ui.card "Upload audio"
        [ case upload.status of
            Idle ->
                input
                    [ type_ "file"
                    , class "form-control-file"
                    , multiple False
                    , on "change" (Upload.onChange (toMsg << UploadMsg))
                    ]
                    []

            Uploading fraction ->
                Progress.progress
                    [ Progress.value (100 * fraction)
                    , Progress.striped
                    , Progress.animated
                    ]

            Done ->
                div []
                    [ h5 [] [ text "File info" ]
                    , div [] (List.map fileInfo upload.files)
                    , h5 [] [ text "Audio description" ]
                    , Form.Content.Audio.Create.view tagInput form disabled (toMsg << FormMsg)
                    ]

            Fail ->
                h1 [] [ text "FAIL" ]
        ]
