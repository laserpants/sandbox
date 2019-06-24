module Form.User.Register exposing (Fields, LoginAvailableStatus(..), toJson, validate, view)

import Bootstrap.Button as Button
import Bootstrap.Form
import Bootstrap.Form.Checkbox as Checkbox
import Bootstrap.Form.Fieldset as Fieldset
import Bootstrap.Form.Input as Input
import Bootstrap.Form.Select as Select
import Bootstrap.Form.Textarea as Textarea
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
    , email : String
    , useEmailAsLogin : Bool
    , login : String
    , country : String
    , phoneNumber : Maybe String
    , organization : Maybe String
    , industry : Maybe String
    , password : String
    , passwordConfirmation : String
    , agreeWithTerms : Bool
    }


type LoginAvailableStatus
    = Blank
    | IsAvailable Bool
    | Unknown


validateLogin : Field -> Result (Error CustomError) String
validateLogin =
    field "useEmailAsLogin" Validate.bool
        |> andThen
            (\useEmail ->
                if useEmail then
                    Validate.succeed ""

                else
                    field "login" (validateStringNonEmpty |> andThen (Validate.minLength 2))
            )


validate : Validation CustomError Fields
validate =
    succeed Fields
        |> andMap (field "name" validateStringNonEmpty)
        |> andMap (field "email" validateEmail)
        |> andMap (field "useEmailAsLogin" Validate.bool)
        |> andMap validateLogin
        |> andMap (field "country" validateStringNonEmpty)
        |> andMap (field "phoneNumber" (Validate.maybe validateStringNonEmpty))
        |> andMap (field "organization" (Validate.maybe validateStringNonEmpty))
        |> andMap (field "industry" (Validate.maybe validateStringNonEmpty))
        |> andMap (field "password" validatePassword)
        |> andMap (validatePasswordConfirmation "password" "passwordConfirmation")
        |> andMap (field "agreeWithTerms" validateChecked)


toJson : Fields -> Json.Value
toJson { name, email, useEmailAsLogin, login, country, phoneNumber, organization, industry, password } =
    Encode.object
        [ ( "name", Encode.string name )
        , ( "email", Encode.string email )
        , ( "login"
          , Encode.string
                (if useEmailAsLogin then
                    email

                 else
                    login
                )
          )
        , ( "country", Encode.string country )
        , ( "phoneNumber", Encode.maybe Encode.string phoneNumber )
        , ( "organization", Encode.maybe Encode.string organization )
        , ( "industry", Encode.maybe Encode.string industry )
        , ( "password", Encode.string password )
        ]


view : Form CustomError Fields -> Bool -> LoginAvailableStatus -> (Form.Msg -> msg) -> Html msg
view form disabled loginAvailableStatus toMsg =
    let
        info =
            fieldInfo customErrorToString []

        name =
            form |> Form.getFieldAsString "name" |> info Input.danger

        email =
            form |> Form.getFieldAsString "email" |> info Input.danger

        useEmailAsLogin =
            form |> Form.getFieldAsBool "useEmailAsLogin" |> info Checkbox.danger

        country =
            form |> Form.getFieldAsString "country" |> info Select.danger

        phoneNumber =
            form |> Form.getFieldAsString "phoneNumber" |> info Input.danger

        industry =
            form |> Form.getFieldAsString "industry" |> info Select.danger

        organization =
            form |> Form.getFieldAsString "organization" |> info Input.danger

        password =
            form |> Form.getFieldAsString "password" |> info Input.danger

        passwordConfirmation =
            form |> Form.getFieldAsString "passwordConfirmation" |> info Input.danger

        agreeWithTerms =
            form |> Form.getFieldAsBool "agreeWithTerms" |> info Checkbox.danger

        login =
            let
                loginField =
                    form |> Form.getFieldAsString "login"

                loginInfo =
                    info Input.danger loginField
            in
            case ( loginField.error, loginAvailableStatus ) of
                ( Nothing, IsAvailable True ) ->
                    { loginInfo
                        | options = [ Input.success ]
                    }

                ( _, IsAvailable False ) ->
                    { loginInfo
                        | options = [ Input.danger ]
                        , errorMessage = "This username is not available"
                    }

                _ ->
                    loginInfo
    in
    [ Fieldset.config
        |> Fieldset.disabled disabled
        |> Fieldset.children
            [ Bootstrap.Form.label [] [ b [] [ text "Personal" ] ]
            , Bootstrap.Form.group []
                [ Input.text
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
                [ Input.text
                    ([ Input.placeholder "Email"
                     , Input.onInput (String >> Form.Input email.path Form.Text)
                     , Input.value (Maybe.withDefault "" email.value)
                     , Input.attrs [ onFocus (Form.Focus email.path), onBlur (Form.Blur email.path) ]
                     ]
                        ++ email.options
                    )
                , Bootstrap.Form.invalidFeedback [] [ text email.errorMessage ]
                ]
            , Bootstrap.Form.group []
                [ Select.select
                    ([ Select.onChange (String >> Form.Input country.path Form.Select)
                     , Select.attrs [ onFocus (Form.Focus country.path), onBlur (Form.Blur country.path) ]
                     ]
                        ++ country.options
                    )
                    (List.map (selectItem country.value) [ ( "", "Country" ), ( "FI", "Finland" ), ( "MW", "Malawi" ), ( "GH", "Ghana" ), ( "UG", "Uganda" ) ])
                , Bootstrap.Form.invalidFeedback [] [ text country.errorMessage ]
                ]
            , Bootstrap.Form.group []
                [ Input.text
                    ([ Input.placeholder "Phone number"
                     , Input.onInput (String >> Form.Input phoneNumber.path Form.Text)
                     , Input.value (Maybe.withDefault "" phoneNumber.value)
                     , Input.attrs [ onFocus (Form.Focus phoneNumber.path), onBlur (Form.Blur phoneNumber.path) ]
                     ]
                        ++ phoneNumber.options
                    )
                , Bootstrap.Form.invalidFeedback [] [ text phoneNumber.errorMessage ]
                ]
            , Bootstrap.Form.group []
                [ Checkbox.custom
                    ([ Checkbox.id "register-use-email-as-login"
                     , Checkbox.onCheck (Bool >> Form.Input useEmailAsLogin.path Form.Checkbox)
                     , Checkbox.checked (useEmailAsLogin.value |> Maybe.withDefault False)
                     ]
                        ++ useEmailAsLogin.options
                    )
                    "Use email as login"
                , if Just True /= useEmailAsLogin.value then
                    text ""

                  else
                    Bootstrap.Form.help [] [ text "Uncheck this checkbox if you’d like to use a login different from your email address." ]
                , Bootstrap.Form.invalidFeedback [] [ text useEmailAsLogin.errorMessage ]
                ]
            , if Just True == useEmailAsLogin.value then
                text ""

              else
                Bootstrap.Form.group []
                    [ Input.text
                        ([ Input.placeholder "Login"
                         , Input.onInput (String >> Form.Input login.path Form.Text)
                         , Input.value (Maybe.withDefault "" login.value)
                         , Input.attrs [ onFocus (Form.Focus login.path), onBlur (Form.Blur login.path) ]
                         ]
                            ++ login.options
                        )
                    , Bootstrap.Form.invalidFeedback [] [ text login.errorMessage ]
                    , text (Debug.toString loginAvailableStatus)
                    ]
            , hr [] []
            , Bootstrap.Form.group []
                [ Bootstrap.Form.label [] [ b [] [ text "Password" ] ]
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
                [ Input.password
                    ([ Input.placeholder "Confirm password"
                     , Input.onInput (String >> Form.Input passwordConfirmation.path Form.Text)
                     , Input.value (Maybe.withDefault "" passwordConfirmation.value)
                     , Input.attrs [ onFocus (Form.Focus passwordConfirmation.path), onBlur (Form.Blur passwordConfirmation.path) ]
                     ]
                        ++ passwordConfirmation.options
                    )
                , Bootstrap.Form.invalidFeedback [] [ text passwordConfirmation.errorMessage ]
                ]
            , hr [] []
            , Bootstrap.Form.label [] [ b [] [ text "Work affiliation" ] ]
            , Bootstrap.Form.group []
                [ Input.text
                    ([ Input.placeholder "Organization"
                     , Input.onInput (String >> Form.Input organization.path Form.Text)
                     , Input.value (Maybe.withDefault "" organization.value)
                     , Input.attrs [ onFocus (Form.Focus organization.path), onBlur (Form.Blur organization.path) ]
                     ]
                        ++ organization.options
                    )
                , Bootstrap.Form.invalidFeedback [] [ text organization.errorMessage ]
                ]
            , Bootstrap.Form.group []
                [ Select.select
                    ([ Select.onChange (String >> Form.Input industry.path Form.Select)
                     , Select.attrs [ onFocus (Form.Focus industry.path), onBlur (Form.Blur industry.path) ]
                     ]
                        ++ industry.options
                    )
                    (List.map (selectItem industry.value) [ ( "", "Industry" ), ( "ngo", "NGO/INGO" ), ( "media", "Media" ), ( "agriculture", "Agriculture" ), ( "education-research", "Education/Research" ), ( "government", "Government" ), ( "marketing-advertising", "Marketing/Advertising" ), ( "independent", "Independent" ), ( "other", "Other" ) ])
                , Bootstrap.Form.invalidFeedback [] [ text industry.errorMessage ]
                ]
            , hr [] []
            , Bootstrap.Form.group []
                [ Bootstrap.Form.label []
                    [ b [] [ text "Terms and conditions" ]
                    ]
                , Textarea.textarea
                    [ Textarea.attrs [ style "height" "97px", style "font-size" "11pt", readonly True ]
                    , Textarea.value "TODO TODO"
                    ]
                ]
            , Bootstrap.Form.group []
                [ Checkbox.custom
                    ([ Checkbox.id "register-agree-with-terms"
                     , Checkbox.onCheck (Bool >> Form.Input agreeWithTerms.path Form.Checkbox)
                     , Checkbox.checked (agreeWithTerms.value |> Maybe.withDefault False)
                     ]
                        ++ agreeWithTerms.options
                    )
                    "I agree with the terms of this service"
                , Bootstrap.Form.invalidFeedback [ style "display" "block" ] [ text agreeWithTerms.errorMessage ]
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
                            "Send"
                        )
                    ]
                ]
            ]
        |> Fieldset.view
    ]
        |> Bootstrap.Form.form [ onSubmit Form.Submit ]
        |> Html.map toMsg
