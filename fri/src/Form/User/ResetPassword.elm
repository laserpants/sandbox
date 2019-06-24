module Form.User.ResetPassword exposing (Fields, toJson, validate, view)

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
    { login : String
    }


validate : Validation Never Fields
validate =
    succeed Fields
        |> andMap (field "login" validateStringNonEmpty)


toJson : Fields -> Json.Value
toJson { login } =
    Encode.object
        [ ( "login", Encode.string login )
        ]


view : Form Never Fields -> Bool -> (Form.Msg -> msg) -> Html msg
view form disabled toMsg =
    let
        info =
            fieldInfo (always "")

        login =
            form |> Form.getFieldAsString "login" |> info [] Input.danger
    in
    [ Fieldset.config
        |> Fieldset.disabled disabled
        |> Fieldset.children
            [ Bootstrap.Form.group []
                [ Bootstrap.Form.label [] [ text "Login or email" ]
                , Input.text
                    ([ Input.onInput (String >> Form.Input login.path Form.Text)
                     , Input.value (Maybe.withDefault "" login.value)
                     , Input.attrs [ onFocus (Form.Focus login.path), onBlur (Form.Blur login.path) ]
                     ]
                        ++ login.options
                    )
                , Bootstrap.Form.invalidFeedback [] [ text login.errorMessage ]
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
                            "Send request"
                        )
                    ]
                ]
            ]
        |> Fieldset.view
    ]
        |> Bootstrap.Form.form [ onSubmit Form.Submit ]
        |> Html.map toMsg
