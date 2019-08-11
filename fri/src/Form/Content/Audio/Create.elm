module Form.Content.Audio.Create exposing (Fields, toJson, validate, view)

import Bootstrap.Button as Button
import Bootstrap.ButtonGroup as ButtonGroup
import Bootstrap.Form
import Bootstrap.Form.Fieldset as Fieldset
import Bootstrap.Form.Input as Input
import Bootstrap.Form.Select as Select
import Bootstrap.Form.Textarea as Textarea
import Bootstrap.Utilities.Spacing as Spacing
import Form exposing (Form)
import Form.Error exposing (Error, ErrorValue(..))
import Form.Field exposing (Field, FieldValue(..))
import Form.Validate as Validate exposing (Validation, andMap, andThen, customError, fail, field, oneOf, succeed)
import Helpers.Form exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Json.Encode as Encode
import Json.Encode.Extra as Encode
import Ui.TagInput


type alias Fields =
    { title : String
    , description : Maybe String
    }


validate : Validation Never Fields
validate =
    succeed Fields
        |> andMap (field "title" validateStringNonEmpty)
        |> andMap (field "description" (Validate.maybe validateStringNonEmpty))


toJson : Fields -> Json.Value
toJson { title, description } =
    Encode.object
        [ ( "title", Encode.string title )
        , ( "description", Encode.maybe Encode.string description )
        ]


view : (List (Input.Option Ui.TagInput.Msg) -> String -> Bool -> Html msg) -> Form Never Fields -> Bool -> (Form.Msg -> msg) -> Html msg
view tags form disabled toMsg =
    let
        info =
            fieldInfo (always "")

        title =
            form |> Form.getFieldAsString "title" |> info [] Input.danger

        description =
            form |> Form.getFieldAsString "description" |> info [] Textarea.danger

        { options, errorMessage } =
            form |> Form.getFieldAsString "tags" |> info [] Input.danger
    in
    [ Fieldset.config
        |> Fieldset.disabled disabled
        |> Fieldset.children
            [ Bootstrap.Form.group []
                [ Bootstrap.Form.label [] [ text "Title" ]
                , Input.text
                    ([ Input.placeholder "Title"
                     , Input.onInput (String >> Form.Input title.path Form.Text)
                     , Input.value (Maybe.withDefault "" title.value)
                     , Input.attrs [ onFocus (Form.Focus title.path), onBlur (Form.Blur title.path) ]
                     ]
                        ++ title.options
                    )
                    |> Html.map toMsg
                , Bootstrap.Form.invalidFeedback [] [ text title.errorMessage ]
                ]
            , Bootstrap.Form.group []
                [ Bootstrap.Form.label [] [ text "Description" ]
                , Textarea.textarea
                    ([ Textarea.onInput (String >> Form.Input description.path Form.Text)
                     , Textarea.value (Maybe.withDefault "" description.value)
                     , Textarea.attrs [ onFocus (Form.Focus description.path), onBlur (Form.Blur description.path) ]
                     ]
                        ++ description.options
                    )
                    |> Html.map toMsg
                , Bootstrap.Form.invalidFeedback [] [ text description.errorMessage ]
                ]
            , Bootstrap.Form.group []
                [ Bootstrap.Form.label [] [ text "Tags" ]
                , tags options errorMessage disabled
                , Bootstrap.Form.help [] [ text "Press the <Tab> key after entering a tag to add it." ]
                ]
            , Bootstrap.Form.group []
                [ Button.button
                    [ Button.primary
                    , Button.onClick Form.Submit
                    , Button.disabled disabled
                    ]
                    [ text
                        (if disabled then
                            "Please wait"

                         else
                            "Save"
                        )
                    ]
                    |> Html.map toMsg
                ]
            ]
        |> Fieldset.view
    ]
        |> Bootstrap.Form.form []
