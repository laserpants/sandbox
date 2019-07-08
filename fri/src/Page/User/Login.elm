module Page.User.Login exposing (Msg(..), State, init, subscriptions, update, view)

import Bootstrap.Alert as Alert
import Bootstrap.Grid as Grid
import Bootstrap.Grid.Col as Col
import Bootstrap.Grid.Row as Row
import Bootstrap.Utilities.Spacing as Spacing
import Data.Session as Session exposing (Session)
import Form.User.Login
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as Json
import Update.Deep exposing (..)
import Update.Deep.Api as Api
import Update.Deep.Form as Form


type Msg
    = ApiMsg (Api.Msg Session)
    | FormMsg Form.Msg


type alias State =
    { api : Api.Model Session
    , formModel : Form.Model Never Form.User.Login.Fields
    }


inApi : Wrap State Msg (Api.Model Session) (Api.Msg Session) a
inApi =
    Api.component ApiMsg


inForm : Wrap State Msg (Form.Model Never Form.User.Login.Fields) Form.Msg a
inForm =
    Form.component FormMsg


init : Update State msg a
init =
    let
        api =
            Api.init
                { endpoint = "/auth/login"
                , method = Api.HttpPost
                , decoder = Json.field "session" Session.decoder
                }
    in
    save State
        |> andMap api
        |> andMap (Form.init [] Form.User.Login.validate)


handleSubmit : Form.User.Login.Fields -> State -> Update State Msg a
handleSubmit form =
    let
        json =
            form |> Form.User.Login.toJson |> Http.jsonBody
    in
    inApi (Api.sendRequest "" (Just json))


update : { onAuthResponse : Maybe Session -> a } -> Msg -> State -> Update State Msg a
update { onAuthResponse } msg =
    let
        handleApiResponse maybeSession =
            inForm (Form.reset [])
                >> andApplyCallback (onAuthResponse maybeSession)
    in
    case msg of
        ApiMsg apiMsg ->
            inApi (Api.update { onSuccess = Just >> handleApiResponse, onError = always (handleApiResponse Nothing) } apiMsg)

        FormMsg formMsg ->
            inForm (Form.update { onSubmit = handleSubmit } formMsg)


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
            [ Col.lg6
            , Col.attrs
                [ class "d-none d-lg-block bg-register-image"
                , style "min-height" "600px"
                , style "background-image" "url(/img/bg-register.jpg)"
                ]
            ]
            []
        , Grid.col
            [ Col.lg6
            ]
            [ div [ Spacing.p5 ]
                [ h2
                    [ Spacing.mb4
                    , class "text-gray-900 text-center"
                    ]
                    [ text "Log in" ]
                , p [] [ Alert.simplePrimary [] [ text "This is a demo. Log in using 'test' and password 'test'." ] ]
                , Form.User.Login.view form disabled (toMsg << FormMsg)
                , hr [] []
                , div [ class "text-center" ]
                    [ a [ href "/reset-password" ] [ text "Forgot password?" ]
                    , span [ class "mx-2" ] [ text "|" ]
                    , a [ href "/register" ] [ text "Create an account" ]
                    ]
                ]
            ]
        ]
