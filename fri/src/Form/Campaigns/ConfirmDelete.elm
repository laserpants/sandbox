module Form.Campaigns.ConfirmDelete exposing (Fields, toJson, validate, view)

import Bootstrap.Button as Button
import Bootstrap.Form
import Bootstrap.Form.Checkbox as Checkbox
import Bootstrap.Form.Fieldset as Fieldset
import Bootstrap.Form.Input as Input
import Form exposing (Form)
import Form.Field exposing (FieldValue(..))
import Form.Validate as Validate exposing (Validation, andMap, field, succeed)
import Helpers.Form exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Json.Encode as Encode


type alias Fields =
    { name : String
    }


validate : Validation CustomError Fields
validate =
    succeed Fields
        |> andMap (field "name" (validateStringEquals "banana"))


toJson : Fields -> Json.Value
toJson { name } =
    Encode.object
        [ ( "name", Encode.string name )
        ]


view : Form CustomError Fields -> Bool -> (Form.Msg -> msg) -> Html msg
view form disabled toMsg =
    let
        info =
            fieldInfo customErrorToString []

        name =
            form |> Form.getFieldAsString "name" |> info Input.danger
    in
    [ Fieldset.config
        |> Fieldset.disabled disabled
        |> Fieldset.children
            [ Bootstrap.Form.group []
                [ Input.text
                    ([ Input.placeholder "Type the name of the campaign to confirm"
                     , Input.onInput (String >> Form.Input name.path Form.Text)
                     , Input.value (Maybe.withDefault "" name.value)
                     , Input.attrs [ onFocus (Form.Focus name.path), onBlur (Form.Blur name.path) ]
                     ]
                        ++ name.options
                    )
                , Bootstrap.Form.invalidFeedback [] [ text name.errorMessage ]
                ]
            , Bootstrap.Form.group []
                [ Button.button
                    [ Button.block
                    , Button.primary
                    , Button.onClick Form.Submit
                    , Button.disabled disabled
                    ]
                    [ text
                        (if disabled then
                            "Please wait"

                         else
                            "Delete"
                        )
                    ]
                ]
            ]
        |> Fieldset.view
    ]
        |> Bootstrap.Form.form [ onSubmit Form.Submit ]
        |> Html.map toMsg
