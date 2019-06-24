module Helpers.Form exposing (CustomError(..), customErrorToString, errorToString, fieldInfo, selectItem, validateChecked, validateEmail, validatePassword, validatePasswordConfirmation, validateStringNonEmpty)

import Bootstrap.Form.Select as Select
import Form.Error exposing (Error, ErrorValue(..))
import Form.Field exposing (Field, FieldValue(..))
import Form.Validate as Validate exposing (andThen, customError, fail, field, minLength, oneOf, succeed)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


type CustomError
    = PasswordConfirmationMismatch
    | MustAgreeWithTerms


customErrorToString : CustomError -> String
customErrorToString error =
    case error of
        PasswordConfirmationMismatch ->
            "Password confirmation doesn’t match password"

        MustAgreeWithTerms ->
            "You must agree with the terms of this service to complete the registration"


validatePasswordConfirmation : String -> String -> Field -> Result (Error CustomError) String
validatePasswordConfirmation passwordField confirmField =
    let
        match password confirmation =
            if password == confirmation then
                succeed confirmation

            else
                fail (customError PasswordConfirmationMismatch)
    in
    [ Validate.string, Validate.emptyString ]
        |> oneOf
        |> field passwordField
        |> andThen
            (\value ->
                validateStringNonEmpty
                    |> andThen (match value)
                    |> field confirmField
            )


validateChecked : Field -> Result (Error CustomError) Bool
validateChecked =
    Validate.bool
        |> andThen
            (\checked ->
                if checked then
                    succeed True

                else
                    fail (customError MustAgreeWithTerms)
            )


validatePassword : Field -> Result (Error e) String
validatePassword =
    validateStringNonEmpty
        |> andThen (minLength 8)


validateStringNonEmpty : Field -> Result (Error e) String
validateStringNonEmpty =
    [ Validate.string, Validate.emptyString ]
        |> oneOf
        |> andThen Validate.nonEmpty


validateEmail : Field -> Result (Error e) String
validateEmail =
    validateStringNonEmpty
        |> andThen (always Validate.email)


errorToString : (a -> String) -> ErrorValue a -> String
errorToString customError error =
    case error of
        Empty ->
            "This field is required"

        InvalidString ->
            "Not a valid string"

        InvalidEmail ->
            "Not a valid email address"

        InvalidFormat ->
            "Invalid format"

        InvalidInt ->
            "This value must be an integer"

        InvalidFloat ->
            "This value must be a real number"

        InvalidBool ->
            "Not a valid boolean"

        SmallerIntThan int ->
            "Must be at least " ++ String.fromInt int

        GreaterIntThan int ->
            "Must be no more than " ++ String.fromInt int

        SmallerFloatThan float ->
            "Error"

        -- TODO
        GreaterFloatThan float ->
            "Error"

        -- TODO
        ShorterStringThan int ->
            "Must be at least " ++ String.fromInt int ++ " characters"

        LongerStringThan int ->
            "Must be no more than " ++ String.fromInt int ++ " characters"

        NotIncludedIn ->
            "Invalid option"

        CustomError e ->
            customError e


fieldInfo :
    (a -> String)
    -> List b
    -> b
    -> { e | liveError : Maybe (ErrorValue a), path : c, value : d }
    ->
        { errorMessage : String
        , hasError : Bool
        , options : List b
        , path : c
        , value : d
        }
fieldInfo custom options danger { liveError, path, value } =
    case liveError of
        Nothing ->
            { path = path
            , value = value
            , hasError = False
            , options = options
            , errorMessage = ""
            }

        Just error ->
            { path = path
            , value = value
            , hasError = True
            , options = [ danger ] ++ options
            , errorMessage = errorToString custom error
            }


selectItem : Maybe String -> ( String, String ) -> Select.Item msg
selectItem current ( k, v ) =
    Select.item [ value k, selected (current == Just k) ] [ text v ]
