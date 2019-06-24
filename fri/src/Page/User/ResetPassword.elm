module Page.User.ResetPassword exposing (Msg(..), State, init, subscriptions, update, view)

import Bootstrap.Grid as Grid
import Bootstrap.Grid.Col as Col
import Bootstrap.Grid.Row as Row
import Bootstrap.Utilities.Spacing as Spacing
import Form.User.ResetPassword
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Update.Deep exposing (..)
import Update.Deep.Api as Api
import Update.Deep.Form as Form


type Msg
    = FormMsg Form.Msg


type alias State =
    { formModel : Form.Model Never Form.User.ResetPassword.Fields
    , response : Api.Model { status : Int }
    }


inForm : In State (Form.Model Never Form.User.ResetPassword.Fields) msg a
inForm =
    inState { get = .formModel, set = \state form -> { state | formModel = form } }


init : (Msg -> msg) -> Update State msg a
init toMsg =
    let
        response =
            Api.init
                { endpoint = "/auth/reset_password"
                , method = Api.HttpPost
                , decoder = Json.map (\status -> { status = status }) Json.int
                }
    in
    save State
        |> andMap (Form.init [] Form.User.ResetPassword.validate)
        |> andMap response
        |> mapCmd toMsg


update : Msg -> (Msg -> msg) -> State -> Update State msg a
update msg toMsg =
    case msg of
        FormMsg formMsg ->
            inForm (Form.update { onSubmit = always save } formMsg)


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions state toMsg =
    Sub.none


view : State -> (Msg -> msg) -> Html msg
view { formModel } toMsg =
    let
        { form, disabled } =
            formModel
    in
    Grid.row []
        [ Grid.col
            [ Col.lg12
            ]
            [ div [ Spacing.p5 ]
                [ div [ class "text-center" ]
                    [ i [ style "font-size" "64px", class "fas fa-meh-rolling-eyes mb-3" ] []
                    , h2 [ class "text-gray-900 mb-4" ] [ text "Lost your password?" ]
                    ]
                , p [] [ text "Yes, well it happens. Enter your login or email address in the field below and press the ‘Request’ button. If we find a matching account, an email will be sent with further instructions." ]
                , Form.User.ResetPassword.view form disabled (toMsg << FormMsg)
                , hr [] []
                , div [ class "text-center" ]
                    [ a [ href "/login" ] [ text "Return to login" ] ]
                ]
            ]
        ]
