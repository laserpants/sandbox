module Ui exposing (Msg(..), State, card, dashboardLayout, fetchNotifications, gdprBanner, init, layout, subscriptions, update)

import Bootstrap.Button as Button
import Bootstrap.Card as Card
import Bootstrap.Card.Block as Block
import Bootstrap.Grid as Grid
import Bootstrap.Grid.Col as Col
import Bootstrap.Grid.Row as Row
import Bootstrap.Utilities.Flex as Flex
import Bootstrap.Utilities.Spacing as Spacing
import Data.Notification as Notification exposing (Notification)
import Data.Project exposing (Project)
import Data.Session exposing (Session)
import Data.User exposing (User)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Maybe.Extra as Maybe
import Ui.Gdpr as Gdpr
import Ui.Navbar as Navbar
import Ui.Notifications as Notifications
import Ui.Sidebar as Sidebar
import Update.Deep exposing (..)
import Update.Deep.Api as Api exposing (Resource(..))


type Msg
    = SidebarMsg Sidebar.Msg
    | NavbarMsg Navbar.Msg
    | NotificationsMsg Notifications.Msg


type alias State =
    { sidebar : Sidebar.State
    , navbar : Navbar.State
    , notifications : Notifications.State
    }


inSidebar : In State Sidebar.State msg a
inSidebar =
    inState { get = .sidebar, set = \state sidebar -> { state | sidebar = sidebar } }


inNavbar : In State Navbar.State msg a
inNavbar =
    inState { get = .navbar, set = \state navbar -> { state | navbar = navbar } }


inNotifications : In State Notifications.State msg a
inNotifications =
    inState { get = .notifications, set = \state notifications -> { state | notifications = notifications } }


init : (Msg -> msg) -> Update State msg a
init toMsg =
    save State
        |> andMap (Sidebar.init SidebarMsg)
        |> andMap (Navbar.init NavbarMsg)
        |> andMap (Notifications.init NotificationsMsg)
        |> mapCmd toMsg


fetchNotifications : (Msg -> msg) -> State -> Update State msg a
fetchNotifications toMsg =
    inNotifications (Notifications.fetchNotifications (toMsg << NotificationsMsg))


update : { onDismissNotification : Int -> a, onChangeLocale : String -> a } -> Msg -> (Msg -> msg) -> State -> Update State msg a
update { onDismissNotification, onChangeLocale } msg toMsg =
    case msg of
        SidebarMsg sidebarMsg ->
            Sidebar.update sidebarMsg (toMsg << SidebarMsg)
                |> inSidebar

        NavbarMsg navbarMsg ->
            Navbar.update
                { onNotificationSelected = inNotifications << Notifications.showNotification
                , onToggleSidebar = inSidebar Sidebar.toggle
                , onChangeLocale = applyCallback << onChangeLocale
                }
                navbarMsg
                (toMsg << NavbarMsg)
                |> inNavbar

        NotificationsMsg notificationsMsg ->
            Notifications.update { onDismissNotification = applyCallback << onDismissNotification } notificationsMsg (toMsg << NotificationsMsg)
                |> inNotifications


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions { sidebar, navbar, notifications } toMsg =
    Sub.batch
        [ Sidebar.subscriptions sidebar (toMsg << SidebarMsg)
        , Navbar.subscriptions navbar (toMsg << NavbarMsg)
        , Notifications.subscriptions notifications (toMsg << NotificationsMsg)
        ]


type alias LayoutConfig msg =
    { colAttrs : List (Col.Option msg)
    , bgClass : String
    }


layout : State -> (Msg -> msg) -> LayoutConfig msg -> List (Html msg) -> Html msg
layout state toMsg { colAttrs, bgClass } pageElements =
    div [ class bgClass, style "min-height" "100vh" ]
        [ Grid.container []
            [ Grid.row [ Row.attrs [ Flex.justifyCenter ] ]
                [ Grid.col colAttrs
                    [ Card.config [ Card.attrs [ class "card o-hidden border-0 shadow-sm my-5" ] ]
                        |> Card.block [ Block.attrs [ Spacing.p0 ] ]
                            [ Block.text [] pageElements ]
                        |> Card.view
                    ]
                ]
            ]
        ]


dashboardLayout : State -> User -> Project -> String -> (Msg -> msg) -> List (Html msg) -> Html msg
dashboardLayout { navbar, sidebar, notifications } user project locale toMsg pageElements =
    div []
        [ Navbar.view navbar
            { user = user
            , locale = locale
            , notificationsResource = notifications.list.resource
            }
            (toMsg << NavbarMsg)
        , div [ id "wrapper" ]
            [ Sidebar.view sidebar (toMsg << SidebarMsg)
            , div [ id "content-wrapper", class "d-flex flex-column" ]
                [ div [ id "content" ]
                    [ div [ Spacing.mt4, class "container-fluid" ] pageElements ]
                ]
            ]
        , Notifications.modalView notifications (toMsg << NotificationsMsg)
        ]


card : String -> List (Html msg) -> Html msg
card title elements =
    Card.config []
        |> Card.block []
            [ Block.text []
                [ h2 [ class "text-gray-900", class "mb-4" ]
                    [ text title ]
                , div [ Spacing.mb4 ] elements
                ]
            ]
        |> Card.view


gdprBanner : msg -> Maybe Session -> Bool -> Html msg
gdprBanner onClick maybeSession accepted =
    if accepted || Maybe.isJust maybeSession then
        text ""

    else
        Gdpr.banner
            [ Grid.row []
                [ Grid.col [ Col.lg10, Col.attrs [ class "text-white" ] ] [ text "We use technologies such as cookies and device storage to collect information about our users and how they access this service. In accordance with European Union data protection regulations (GDPR), we ask for your permission to do this in order to make this service available to you." ]
                , Grid.col [ Col.lg2, Col.attrs [ class "text-right" ] ] [ Button.button [ Button.primary, Button.onClick onClick ] [ text "I accept" ] ]
                ]
            ]
