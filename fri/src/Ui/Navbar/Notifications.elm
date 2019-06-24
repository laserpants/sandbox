module Ui.Navbar.Notifications exposing (button, dropdown)

import Bootstrap.Button as Button
import Data.Notification exposing (Notification)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Ui.Spinner exposing (navbarSpinner)
import Update.Deep.Api as Api exposing (Resource(..))


dropdown : (Notification -> msg) -> Bool -> Api.Resource (List Notification) -> Html msg
dropdown showNotification open resource =
    let
        menuClass =
            (if open then
                "show "

             else
                ""
            )
                ++ "dropdown-list dropdown-menu dropdown-menu-right shadow-sm animated--grow-in"

        menuItem notification =
            span
                [ onClick (showNotification notification)
                , style "cursor" "pointer"
                , class "dropdown-item d-flex align-items-center"
                ]
                [ div
                    [ class "mr-3" ]
                    [ div
                        [ class "icon-circle bg-success"
                        , style "width" "2.8rem"
                        , style "height" "2.8rem"
                        ]
                        [ i
                            [ style "font-size" "1.85em"
                            , class "fas fa-smile text-white"
                            ]
                            []
                        ]
                    ]
                , div []
                    [ div [ class "small text-gray-500" ] [ text "December 12, 2019" ] -- TODO
                    , span [] [ text notification.message ]
                    ]
                ]
    in
    case resource of
        Available items ->
            div
                [ class menuClass
                ]
                (h6
                    [ class "bg-success border-success dropdown-header" ]
                    [ text "Notifications" ]
                    :: List.map menuItem items
                    ++ [ a
                            [ href "/notifications"
                            , class "dropdown-item text-center text-gray-500"
                            ]
                            [ text "Show all notifications"
                            ]
                       ]
                )

        _ ->
            text ""


button : msg -> Api.Resource (List Notification) -> Html msg
button onClick resource =
    Button.button
        [ Button.small
        , Button.roleLink
        , Button.attrs
            [ style "font-size" "1.4em"
            , class "nav-link dropdown-toggle"
            , Html.Events.onClick onClick
            ]
        ]
        [ case resource of
            Requested ->
                navbarSpinner

            Available items ->
                case List.length items of
                    0 ->
                        text ""

                    count ->
                        span []
                            [ i [ class "fas fa-bell fa-fw" ] []
                            , span
                                [ style "margin-top" "1.1rem"
                                , style "margin-right" "0.1rem"
                                , class "badge badge-danger badge-counter"
                                ]
                                [ text (String.fromInt count) ]
                            ]

            _ ->
                text ""
        ]
