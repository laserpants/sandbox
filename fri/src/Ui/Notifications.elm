module Ui.Notifications exposing (ModalMsg(..), Msg(..), State, component, fetchNotifications, inList, init, modalView, setActiveNotification, setModalVisibility, showNotification, subscriptions, update)

import Bootstrap.Button as Button
import Bootstrap.Modal as Modal
import Bootstrap.Utilities.Spacing as Spacing
import Data.Notification as Notification exposing (Notification)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Update.Deep exposing (..)
import Update.Deep.Api as Api exposing (Resource(..))


type ModalMsg
    = Open
    | Close
    | Animate Modal.Visibility
    | Dismiss Int


type Msg
    = ApiMsg (Api.Msg (List Notification))
    | ModalMsg ModalMsg


type alias State =
    { list : Api.Model (List Notification)
    , modal : Modal.Visibility
    , active : Maybe Notification
    }


component : (Msg -> msg) -> Wrap { b | notifications : State } msg State Msg a
component msg =
    wrapState
        { get = .notifications
        , set = \state notifications -> { state | notifications = notifications }
        , msg = msg
        }


inList : Wrap State Msg (Api.Model (List Notification)) (Api.Msg (List Notification)) a
inList =
    wrapState
        { get = .list
        , set = \state list -> { state | list = list }
        , msg = ApiMsg
        }


setModalVisibility : Modal.Visibility -> State -> Update State msg a
setModalVisibility visibility state =
    save { state | modal = visibility }


setActiveNotification : Notification -> State -> Update State msg a
setActiveNotification notification state =
    save { state | active = Just notification }


showNotification : Notification -> State -> Update State msg a
showNotification notification =
    setActiveNotification notification
        >> andThen (setModalVisibility Modal.shown)


fetchNotifications : State -> Update State Msg a
fetchNotifications =
    inList Api.sendSimpleRequest


init : Update State msg a
init =
    let
        api =
            Api.init
                { endpoint = "/notifications"
                , method = Api.HttpGet
                , decoder = Json.field "notifications" (Json.list Notification.decoder)
                }
    in
    save State
        |> andMap api
        |> andMap (save Modal.hidden)
        |> andMap (save Nothing)


update : { onDismissNotification : Int -> a } -> Msg -> State -> Update State Msg a
update { onDismissNotification } msg =
    case msg of
        ApiMsg apiMsg ->
            inList (Api.update { onSuccess = always save, onError = always save } apiMsg)

        ModalMsg modalMsg ->
            case modalMsg of
                Open ->
                    setModalVisibility Modal.shown

                Close ->
                    setModalVisibility Modal.hidden

                Animate visibility ->
                    setModalVisibility visibility

                Dismiss id ->
                    setModalVisibility Modal.hidden
                        >> andApplyCallback (onDismissNotification id)


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions { modal } toMsg =
    Modal.subscriptions modal (toMsg << ModalMsg << Animate)


modalView : State -> (Msg -> msg) -> Html msg
modalView { active, modal } toMsg =
    case active of
        Nothing ->
            text ""

        Just { id, message } ->
            Modal.config Close
                |> Modal.withAnimation Animate
                |> Modal.body []
                    [ div [ Spacing.m2 ]
                        [ p [] [ text message ]
                        ]
                    ]
                |> Modal.footer []
                    [ Button.button
                        [ Button.primary
                        , Button.block
                        , Button.attrs [ onClick (Dismiss id) ]
                        ]
                        [ text "Got it" ]
                    ]
                |> Modal.view modal
                |> Html.map (toMsg << ModalMsg)
