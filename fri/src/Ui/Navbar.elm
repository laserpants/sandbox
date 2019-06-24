module Ui.Navbar exposing (Msg(..), State, init, subscriptions, update, view)

import Bootstrap.Button as Button
import Browser.Events
import Data.Notification as Notification exposing (Notification)
import Data.User exposing (User)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Ui.Navbar.Language
import Ui.Navbar.Notifications
import Ui.Navbar.UserAccount
import Update.Deep exposing (..)
import Update.Deep.Api as Api exposing (Resource(..))


type Dropdown
    = User
    | Notifications
    | Language


type DropdownStatus
    = Open
    | Listen
    | Closed


type Msg
    = ToggleSidebar
    | ToggleDropdown Dropdown
    | DropdownStatus Dropdown DropdownStatus
    | ShowNotification Notification
    | SetLocale String


toggleDropdownStatus : DropdownStatus -> DropdownStatus
toggleDropdownStatus status =
    case status of
        Open ->
            Closed

        Listen ->
            Closed

        Closed ->
            Open


type alias State =
    { userDropdownStatus : DropdownStatus
    , notificationsDropdownStatus : DropdownStatus
    , languageDropdownStatus : DropdownStatus
    }


setDropdownStatus : Dropdown -> DropdownStatus -> State -> Update State msg a
setDropdownStatus dropdown status state =
    case dropdown of
        User ->
            save { state | userDropdownStatus = status }

        Notifications ->
            save { state | notificationsDropdownStatus = status }

        Language ->
            save { state | languageDropdownStatus = status }


init : (Msg -> msg) -> Update State msg a
init toMsg =
    save State
        |> andMap (save Closed)
        |> andMap (save Closed)
        |> andMap (save Closed)
        |> mapCmd toMsg


update : { onChangeLocale : String -> a, onNotificationSelected : Notification -> a, onToggleSidebar : a } -> Msg -> (Msg -> msg) -> State -> Update State msg a
update { onChangeLocale, onNotificationSelected, onToggleSidebar } msg toMsg =
    case msg of
        ToggleSidebar ->
            applyCallback onToggleSidebar

        ToggleDropdown dropdown ->
            let
                status =
                    case dropdown of
                        User ->
                            .userDropdownStatus

                        Notifications ->
                            .notificationsDropdownStatus

                        Language ->
                            .languageDropdownStatus
            in
            with status (setDropdownStatus dropdown << toggleDropdownStatus)

        DropdownStatus dropdown dropdownStatus ->
            setDropdownStatus dropdown dropdownStatus

        ShowNotification notification ->
            applyCallback (onNotificationSelected notification)

        SetLocale locale ->
            applyCallback (onChangeLocale locale)


dropdownSubscriptions : DropdownStatus -> (DropdownStatus -> msg) -> Sub msg
dropdownSubscriptions status toMsg =
    case status of
        Open ->
            Browser.Events.onAnimationFrame (always (toMsg Listen))

        Listen ->
            Browser.Events.onClick (Json.succeed (toMsg Closed))

        Closed ->
            Sub.none


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions { languageDropdownStatus, userDropdownStatus, notificationsDropdownStatus } toMsg =
    Sub.batch
        [ dropdownSubscriptions userDropdownStatus (toMsg << DropdownStatus User)
        , dropdownSubscriptions notificationsDropdownStatus (toMsg << DropdownStatus Notifications)
        , dropdownSubscriptions languageDropdownStatus (toMsg << DropdownStatus Language)
        ]


view : State -> { user : User, notificationsResource : Api.Resource (List Notification), locale : String } -> (Msg -> msg) -> Html msg
view { languageDropdownStatus, userDropdownStatus, notificationsDropdownStatus } { user, notificationsResource, locale } toMsg =
    nav [ class "navbar navbar-expand navbar-dark bg-success topbar static-top" ]
        [ button
            [ onClick ToggleSidebar
            , class "text-white btn btn-link d-md-none rounded-circle mr-3"
            ]
            [ i [ class "fa fa-bars" ] []
            ]
        , a [ href "/", class "navbar-brand" ] [ text "Farm Radio Interactive" ]
        , ul [ class "navbar-nav ml-auto" ]
            [ li [ class "nav-item dropdown no-arrow" ]
                [ Button.button
                    [ Button.roleLink
                    , Button.attrs [ class "d-none d-md-flex nav-link dropdown-toggle" ]
                    ]
                    [ i [ style "font-size" "1.4em", class "fas fa-credit-card fa-fw" ] []
                    , span [ style "margin-left" "0.35em" ] [ text "1,300" ]
                    ]
                ]
            , li [ class "nav-item dropdown" ]
                [ Ui.Navbar.Language.button (ToggleDropdown Language) locale
                , Ui.Navbar.Language.dropdown SetLocale (Closed /= languageDropdownStatus)
                ]
            , li [ class "mr-2 nav-item dropdown no-arrow" ]
                [ div [ style "min-width" "59px" ]
                    [ Ui.Navbar.Notifications.button (ToggleDropdown Notifications) notificationsResource ]
                , Ui.Navbar.Notifications.dropdown ShowNotification (Closed /= notificationsDropdownStatus) notificationsResource
                ]
            , li [ class "nav-item dropdown" ]
                [ Ui.Navbar.UserAccount.button (ToggleDropdown User) user
                , Ui.Navbar.UserAccount.dropdown (Closed /= userDropdownStatus)
                ]
            ]
        ]
        |> Html.map toMsg
