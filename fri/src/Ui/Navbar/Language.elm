module Ui.Navbar.Language exposing (button, dropdown)

import Bootstrap.Button as Button
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


button : msg -> String -> Html msg
button onClick label =
    Button.button
        [ Button.small
        , Button.onClick onClick
        , Button.roleLink
        , Button.attrs
            [ style "font-size" "1em"
            , class "nav-link dropdown-toggle"
            ]
        ]
        [ b [ class "d-none d-sm-block" ]
            [ text label ]
        ]


dropdown : (String -> msg) -> Bool -> Html msg
dropdown setLocale open =
    let
        menuClass =
            (if open then
                "show "

             else
                ""
            )
                ++ "dropdown-menu dropdown-menu-right shadow-sm animated--grow-in"

        menuItem item =
            span
                [ onClick (setLocale item.locale)
                , style "cursor" "pointer"
                , class "dropdown-item"
                ]
                [ text item.text ]
    in
    div
        [ class menuClass
        ]
        [ div [ class "dropdown-header" ] [ text "Language" ]
        , menuItem { text = "English", locale = "en-us" }
        , menuItem { text = "Français", locale = "fr-ca" }
        , menuItem { text = "Kiswahili", locale = "sw-tz" }
        , menuItem { text = "Esperanto", locale = "eo" }
        ]
