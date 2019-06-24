module Ui.Notifications exposing (ModalMsg(..), Msg(..), State, fetchNotifications, inList, init, modalView, setActiveNotification, setModalVisibility, showNotification, subscriptions, update)

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


inList : In State (Api.Model (List Notification)) msg a
inList =
    inState { get = .list, set = \state list -> { state | list = list } }


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


fetchNotifications : (Msg -> msg) -> State -> Update State msg a
fetchNotifications toMsg =
    inList (Api.sendSimpleRequest (toMsg << ApiMsg))


init : (Msg -> msg) -> Update State msg a
init toMsg =
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
        |> mapCmd toMsg


update : { onDismissNotification : Int -> a } -> Msg -> (Msg -> msg) -> State -> Update State msg a
update { onDismissNotification } msg toMsg =
    case msg of
        ApiMsg apiMsg ->
            Api.update { onSuccess = always save, onError = always save } apiMsg (toMsg << ApiMsg)
                |> inList

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
