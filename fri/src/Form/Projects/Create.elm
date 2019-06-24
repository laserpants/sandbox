module Form.Projects.Create exposing (Fields, toJson, validate, view)

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
    { name : String
    , country : String
    , description : Maybe String
    }


validate : Validation Never Fields
validate =
    succeed Fields
        |> andMap (field "name" validateStringNonEmpty)
        |> andMap (field "country" validateStringNonEmpty)
        |> andMap (field "description" (Validate.maybe validateStringNonEmpty))


toJson : Fields -> Json.Value
toJson { name, country, description } =
    Encode.object
        [ ( "name", Encode.string name )
        , ( "country", Encode.string country )
        , ( "description", Encode.maybe Encode.string description )
        ]


view : Form Never Fields -> Bool -> (Form.Msg -> msg) -> Html msg
view form disabled toMsg =
    let
        info =
            fieldInfo (always "")

        name =
            form |> Form.getFieldAsString "name" |> info [] Input.danger

        country =
            form |> Form.getFieldAsString "country" |> info [] Select.danger

        description =
            form |> Form.getFieldAsString "description" |> info [] Textarea.danger
    in
    [ Fieldset.config
        |> Fieldset.disabled disabled
        |> Fieldset.children
            [ Bootstrap.Form.group []
                [ Bootstrap.Form.label [] [ text "Name" ]
                , Input.text
                    ([ Input.placeholder "Name"
                     , Input.onInput (String >> Form.Input name.path Form.Text)
                     , Input.value (Maybe.withDefault "" name.value)
                     , Input.attrs [ onFocus (Form.Focus name.path), onBlur (Form.Blur name.path) ]
                     ]
                        ++ name.options
                    )
                , Bootstrap.Form.invalidFeedback [] [ text name.errorMessage ]
                ]
            , Bootstrap.Form.group []
                [ Bootstrap.Form.label [] [ text "Country" ]
                , Select.select
                    ([ Select.onChange (String >> Form.Input country.path Form.Select)
                     , Select.attrs [ onFocus (Form.Focus country.path), onBlur (Form.Blur country.path) ]
                     ]
                        ++ country.options
                    )
                    (List.map (selectItem country.value) [ ( "", "" ), ( "FI", "Finland" ), ( "MW", "Malawi" ), ( "GH", "Ghana" ), ( "UG", "Uganda" ) ])
                , Bootstrap.Form.invalidFeedback [] [ text country.errorMessage ]
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
                , Bootstrap.Form.invalidFeedback [] [ text description.errorMessage ]
                ]
            , ButtonGroup.toolbar []
                [ ButtonGroup.buttonGroupItem [ ButtonGroup.attrs [] ]
                    [ ButtonGroup.button
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
                , ButtonGroup.linkButtonGroupItem [ ButtonGroup.attrs [ Spacing.ml1 ] ]
                    [ ButtonGroup.linkButton
                        [ Button.attrs [ href "/projects" ]
                        , Button.secondary
                        , Button.disabled disabled
                        ]
                        [ text "Cancel" ]
                    ]
                ]
            ]
        |> Fieldset.view
    ]
        |> Bootstrap.Form.form []
        |> Html.map toMsg
