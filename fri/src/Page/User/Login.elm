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


inApi : In State (Api.Model Session) msg a
inApi =
    inState { get = .api, set = \state api -> { state | api = api } }


inForm : In State (Form.Model Never Form.User.Login.Fields) msg a
inForm =
    inState { get = .formModel, set = \state form -> { state | formModel = form } }


init : (Msg -> msg) -> Update State msg a
init toMsg =
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
        |> mapCmd toMsg


handleSubmit : (Msg -> msg) -> Form.User.Login.Fields -> State -> Update State msg a
handleSubmit toMsg form =
    let
        json =
            form |> Form.User.Login.toJson |> Http.jsonBody
    in
    inApi (Api.sendRequest "" (Just json) (toMsg << ApiMsg))


update : { onAuthResponse : Maybe Session -> a } -> Msg -> (Msg -> msg) -> State -> Update State msg a
update { onAuthResponse } msg toMsg =
    let
        handleApiResponse maybeSession =
            inForm (Form.reset [])
                >> andApplyCallback (onAuthResponse maybeSession)
    in
    case msg of
        ApiMsg apiMsg ->
            inApi (Api.update { onSuccess = Just >> handleApiResponse, onError = always (handleApiResponse Nothing) } apiMsg (toMsg << ApiMsg))

        FormMsg formMsg ->
            inForm (Form.update { onSubmit = handleSubmit toMsg } formMsg)


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
