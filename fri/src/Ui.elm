module Ui exposing (LayoutConfig, Msg(..), State, card, component, dashboardLayout, fetchNotifications, gdprBanner, init, layout, subscriptions, update)

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
import Ui.Notifications as Notifications exposing (showNotification)
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


component : (Msg -> msg) -> Wrap { b | ui : State } msg State Msg a
component msg =
    wrapState
        { get = .ui
        , set = \state ui -> { state | ui = ui }
        , msg = msg
        }


inSidebar : Wrap State Msg Sidebar.State Sidebar.Msg a
inSidebar =
    Sidebar.component SidebarMsg


inNavbar : Wrap State Msg Navbar.State Navbar.Msg a
inNavbar =
    Navbar.component NavbarMsg


inNotifications : Wrap State Msg Notifications.State Notifications.Msg a
inNotifications =
    Notifications.component NotificationsMsg


init : Update State msg a
init =
    save State
        |> andMap Sidebar.init
        |> andMap Navbar.init
        |> andMap Notifications.init


fetchNotifications : State -> Update State Msg a
fetchNotifications =
    inNotifications Notifications.fetchNotifications


update : { onDismissNotification : Int -> a, onChangeLocale : String -> a } -> Msg -> State -> Update State Msg a
update { onDismissNotification, onChangeLocale } msg =
    case msg of
        SidebarMsg sidebarMsg ->
            inSidebar (Sidebar.update sidebarMsg)

        NavbarMsg navbarMsg ->
            let
                callbacks =
                    { onNotificationSelected = inNotifications << showNotification
                    , onToggleSidebar = inSidebar Sidebar.toggle
                    , onChangeLocale = applyCallback << onChangeLocale
                    }
            in
            inNavbar (Navbar.update callbacks navbarMsg)

        NotificationsMsg notificationsMsg ->
            let
                callbacks =
                    { onDismissNotification = applyCallback << onDismissNotification
                    }
            in
            inNotifications (Notifications.update callbacks notificationsMsg)


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


dashboardLayout : State -> User -> Project -> String -> (Msg -> msg) -> ( Html msg, List ( String, Maybe String ) ) -> Html msg
dashboardLayout { navbar, sidebar, notifications } user project locale toMsg ( page, breadcrumbs ) =
    let
        breadcrumbsLen =
            List.length breadcrumbs

        breadcrumbItem ix ( title, maybeHref ) =
            let
                isLast =
                    breadcrumbsLen - 1 == ix
            in
            li
                ([ class
                    ("breadcrumb-item"
                        ++ (if isLast then
                                " active"

                            else
                                ""
                           )
                    )
                 ]
                    ++ (if isLast then
                            [ attribute "aria-current" "page" ]

                        else
                            []
                       )
                )
                [ case maybeHref of
                    Nothing ->
                        text title

                    Just href ->
                        a [ Html.Attributes.href href ] [ text title ]
                ]
    in
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
                [ case breadcrumbs of
                    [] ->
                        text ""

                    _ ->
                        nav [ attribute "aria-label" "breadcrumb" ]
                            [ ol
                                [ class "breadcrumb"
                                , style "border-radius" "0"
                                , style "background" "inherit"
                                ]
                                (li [ class "breadcrumb-item" ] [ a [ href "/" ] [ text "Home" ] ] :: List.indexedMap breadcrumbItem breadcrumbs)
                            ]
                , div [ id "content" ]
                    [ div
                        [ if List.isEmpty breadcrumbs then
                            Spacing.mt4

                          else
                            Spacing.m0
                        , class "container-fluid"
                        ]
                        [ div [ class "col col-xl-8" ] [ page ] ]
                    ]
                ]
            , Notifications.modalView notifications (toMsg << NotificationsMsg)
            ]
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
