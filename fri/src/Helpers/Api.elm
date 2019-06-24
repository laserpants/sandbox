module Helpers.Api exposing (httpErrorToString, resourceErrorMessage)

import Bootstrap.Alert as Alert
import Bootstrap.Utilities.Spacing as Spacing
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Update.Deep.Api as Api


httpErrorToString : Http.Error -> String
httpErrorToString error =
    case error of
        Http.BadStatus 401 ->
            "Authentication failed."

        Http.BadStatus 500 ->
            "Application error (500 Internal Server Error)"

        Http.BadStatus 501 ->
            "This feature is not implemented"

        _ ->
            "Something went wrong!"


resourceErrorMessage : Api.Resource a -> Html msg
resourceErrorMessage resource =
    case resource of
        Api.Error error ->
            Alert.simpleDanger [ Spacing.mb4 ] [ text (httpErrorToString error) ]

        _ ->
            text ""
