module Form.User.Profile exposing (Fields, validate, view)

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
    , phoneNumber : Maybe String
    , organization : Maybe String
    , industry : Maybe String
    , changePassword : Bool
    , oldPassword : String
    , newPassword : String
    , newPasswordConfirmation : String
    }


validate : Validation CustomError Fields
validate =
    succeed Fields
        |> andMap (field "name" validateStringNonEmpty)
        |> andMap (field "country" validateStringNonEmpty)
        |> andMap (field "phoneNumber" (Validate.maybe validateStringNonEmpty))
        |> andMap (field "organization" (Validate.maybe validateStringNonEmpty))
        |> andMap (field "industry" (Validate.maybe validateStringNonEmpty))
        |> andMap (field "changePassword" Validate.bool)
        |> andMap (field "oldPassword" validatePassword)
        |> andMap (field "newPassword" validatePassword)
        |> andMap (validatePasswordConfirmation "newPassword" "newPasswordConfirmation")


toJson : Fields -> Json.Value
toJson { name, country, phoneNumber, organization, industry, oldPassword, newPassword } =
    Encode.object
        [ ( "name", Encode.string name )
        , ( "country", Encode.string country )
        , ( "phoneNumber", Encode.maybe Encode.string phoneNumber )
        , ( "organization", Encode.maybe Encode.string organization )
        , ( "industry", Encode.maybe Encode.string industry )
        , ( "oldPassword", Encode.string oldPassword )
        , ( "newPassword", Encode.string newPassword )
        ]


view : Form CustomError Fields -> Bool -> (Form.Msg -> msg) -> Html msg
view form disabled toMsg =
    div [] [ text "TODO" ]
