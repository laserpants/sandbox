module Form.Content.Text.Create exposing (Fields, toJson, validate, view)

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


type alias Fields =
    { title : String
    , body : Maybe String
    }


validate : Validation Never Fields
validate =
    succeed Fields
        |> andMap (field "title" validateStringNonEmpty)
        |> andMap (field "body" (Validate.maybe validateStringNonEmpty))


toJson : Fields -> Json.Value
toJson { title, body } =
    Encode.object
        [ ( "title", Encode.string title )
        , ( "body", Encode.maybe Encode.string body )
        ]


view : Form Never Fields -> Bool -> (Form.Msg -> msg) -> Html msg
view form disabled toMsg =
    let
        info =
            fieldInfo (always "")

        title =
            form |> Form.getFieldAsString "title" |> info [] Input.danger

        body =
            form |> Form.getFieldAsString "body" |> info [] Textarea.danger
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
                , Bootstrap.Form.invalidFeedback [] [ text title.errorMessage ]
                ]
            , Bootstrap.Form.group []
                [ Bootstrap.Form.label [] [ text "Body" ]
                , Textarea.textarea
                    ([ Textarea.onInput (String >> Form.Input body.path Form.Text)
                     , Textarea.value (Maybe.withDefault "" body.value)
                     , Textarea.attrs [ onFocus (Form.Focus body.path), onBlur (Form.Blur body.path) ]
                     ]
                        ++ body.options
                    )
                , Bootstrap.Form.invalidFeedback [] [ text body.errorMessage ]
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
                ]
            ]
        |> Fieldset.view
    ]
        |> Bootstrap.Form.form []
        |> Html.map toMsg
