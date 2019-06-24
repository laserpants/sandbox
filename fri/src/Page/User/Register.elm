module Page.User.Register exposing (Msg(..), State, init, subscriptions, update, view)

import Bootstrap.Grid as Grid
import Bootstrap.Grid.Col as Col
import Bootstrap.Grid.Row as Row
import Bootstrap.Utilities.Spacing as Spacing
import Dict exposing (Dict)
import Form as F
import Form.Field as Field exposing (FieldValue(..))
import Form.User.Register exposing (LoginAvailableStatus(..))
import Helpers.Form exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Json.Encode exposing (encode)
import Ports
import Update.Deep exposing (..)
import Update.Deep.Form as Form
import Websocket exposing (..)
import Websocket.LoginAvailable


type Msg
    = FormMsg Form.Msg
    | WebsocketMsg String


type alias State =
    { formModel : Form.Model CustomError Form.User.Register.Fields
    , loginAvailableStatus : LoginAvailableStatus
    , logins : Dict String Bool
    }


saveLoginAvailableStatus : String -> Bool -> State -> Update State msg a
saveLoginAvailableStatus username available state =
    save { state | logins = Dict.insert username available state.logins }


inForm : In State (Form.Model CustomError Form.User.Register.Fields) msg a
inForm =
    inState { get = .formModel, set = \state form -> { state | formModel = form } }


setLoginAvailableStatus : LoginAvailableStatus -> State -> Update State msg a
setLoginAvailableStatus status state =
    save { state | loginAvailableStatus = status }


init : (Msg -> msg) -> Update State msg a
init toMsg =
    save State
        |> andMap (Form.init [ ( "useEmailAsLogin", Field.value (Bool True) ) ] Form.User.Register.validate)
        |> andMap (save Blank)
        |> andMap (save Dict.empty)
        |> mapCmd toMsg


checkIfIsAvailable : String -> State -> Update State msg a
checkIfIsAvailable login =
    if String.isEmpty login then
        setLoginAvailableStatus Blank

    else
        with .logins
            (\logins ->
                case Dict.get login logins of
                    Just isAvailable ->
                        setLoginAvailableStatus (IsAvailable isAvailable)

                    Nothing ->
                        setLoginAvailableStatus Unknown
                            >> andAddCmd (Ports.websocketOut (encode 0 (Websocket.LoginAvailable.encodeQuery login)))
            )


loginFieldSpy : F.Msg -> State -> Update State msg a
loginFieldSpy formMsg =
    case formMsg of
        F.Input "login" F.Text (String login) ->
            checkIfIsAvailable login

        _ ->
            save


update : Msg -> (Msg -> msg) -> State -> Update State msg a
update msg toMsg =
    case msg of
        FormMsg formMsg ->
            inForm (Form.update { onSubmit = always save } formMsg)
                >> andThen (loginFieldSpy formMsg)

        WebsocketMsg websocketMsg ->
            case Json.decodeString Websocket.messageDecoder websocketMsg of
                Ok (Websocket.LoginIsAvailableResponse { login, available }) ->
                    with .formModel
                        (\{ form } ->
                            let
                                loginField =
                                    F.getFieldAsString "login" form
                            in
                            saveLoginAvailableStatus login available
                                >> andThen (checkIfIsAvailable <| Maybe.withDefault "" loginField.value)
                        )

                _ ->
                    save


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions state toMsg =
    Ports.websocketIn (toMsg << WebsocketMsg)


view : State -> (Msg -> msg) -> Html msg
view { formModel, loginAvailableStatus } toMsg =
    let
        { form, disabled } =
            formModel
    in
    Grid.row []
        [ Grid.col
            [ Col.lg12
            ]
            [ div [ Spacing.p5 ]
                [ h2
                    [ Spacing.mb4
                    , class "text-gray-900 text-center"
                    ]
                    [ text "Create an account" ]
                , p [] [ text "Please fill out and submit the form below to sign up for a user account." ]
                , Form.User.Register.view form disabled loginAvailableStatus (toMsg << FormMsg)
                , hr [] []
                , div [ class "text-center" ]
                    [ span [] [ text "Or " ]
                    , a [ href "/login" ] [ text "log in" ]
                    , span [] [ text " if you already have an account." ]
                    ]
                ]
            ]
        ]
