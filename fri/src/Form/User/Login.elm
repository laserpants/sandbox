module Form.User.Login exposing (Fields, toJson, validate, view)

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
    , password : String
    , rememberMe : Bool
    }


validate : Validation Never Fields
validate =
    succeed Fields
        |> andMap (field "login" validateStringNonEmpty)
        |> andMap (field "password" validateStringNonEmpty)
        |> andMap (field "rememberMe" Validate.bool)


toJson : Fields -> Json.Value
toJson { login, password, rememberMe } =
    Encode.object
        [ ( "login", Encode.string login )
        , ( "password", Encode.string password )
        , ( "rememberMe", Encode.bool rememberMe )
        ]


view : Form Never Fields -> Bool -> (Form.Msg -> msg) -> Html msg
view form disabled toMsg =
    let
        info =
            fieldInfo (always "")

        login =
            form |> Form.getFieldAsString "login" |> info [] Input.danger

        password =
            form |> Form.getFieldAsString "password" |> info [] Input.danger

        rememberMe =
            form |> Form.getFieldAsBool "rememberMe" |> info [] Checkbox.danger
    in
    [ Fieldset.config
        |> Fieldset.disabled disabled
        |> Fieldset.children
            [ Bootstrap.Form.group []
                [ Bootstrap.Form.label [] [ text "Login" ]
                , Input.text
                    ([ Input.placeholder "Login"
                     , Input.onInput (String >> Form.Input login.path Form.Text)
                     , Input.value (Maybe.withDefault "" login.value)
                     , Input.attrs [ onFocus (Form.Focus login.path), onBlur (Form.Blur login.path) ]
                     ]
                        ++ login.options
                    )
                , Bootstrap.Form.invalidFeedback [] [ text login.errorMessage ]
                ]
            , Bootstrap.Form.group []
                [ Bootstrap.Form.label [] [ text "Password" ]
                , Input.password
                    ([ Input.placeholder "Password"
                     , Input.onInput (String >> Form.Input password.path Form.Text)
                     , Input.value (Maybe.withDefault "" password.value)
                     , Input.attrs [ onFocus (Form.Focus password.path), onBlur (Form.Blur password.path) ]
                     ]
                        ++ password.options
                    )
                , Bootstrap.Form.invalidFeedback [] [ text password.errorMessage ]
                ]
            , Bootstrap.Form.group []
                [ Checkbox.custom
                    ([ Checkbox.id "login-remember-me"
                     , Checkbox.onCheck (Bool >> Form.Input rememberMe.path Form.Checkbox)
                     , Checkbox.checked (rememberMe.value |> Maybe.withDefault False)
                     ]
                        ++ rememberMe.options
                    )
                    "Remember me"
                , Bootstrap.Form.invalidFeedback [] [ text rememberMe.errorMessage ]
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
                            "Log in"
                        )
                    ]
                ]
            ]
        |> Fieldset.view
    ]
        |> Bootstrap.Form.form [ onSubmit Form.Submit ]
        |> Html.map toMsg
