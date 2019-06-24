module Ui.Navbar.UserAccount exposing (button, dropdown)

import Bootstrap.Button as Button
import Data.User exposing (User)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


dropdown : Bool -> Html msg
dropdown open =
    let
        menuClass =
            (if open then
                "show "

             else
                ""
            )
                ++ "dropdown-menu dropdown-menu-right shadow-sm animated--grow-in"

        dropdownItem item =
            a [ href item.href, class "dropdown-item" ] [ text item.text ]

        dropdownDivider =
            div [ class "dropdown-divider" ] []
    in
    div
        [ class menuClass
        ]
        [ div [ class "dropdown-header" ] [ text "Account" ]
        , dropdownItem { href = "/profile", text = "Profile" }
        , dropdownDivider
        , div [ class "dropdown-header" ] [ text "Project" ]
        , dropdownItem { href = "/settings", text = "Settings" }
        , dropdownItem { href = "/projects", text = "Change project" }
        , dropdownItem { href = "/projects/new", text = "New project" }
        , dropdownDivider
        , dropdownItem { href = "/logout", text = "Log out" }
        ]


button : msg -> User -> Html msg
button onClick user =
    Button.button
        [ Button.roleLink
        , Button.onClick onClick
        , Button.attrs
            [ class "nav-link dropdown-toggle"
            ]
        ]
        [ span
            [ style "font-size" "1em"
            , class "mr-3 d-none d-lg-inline text-white small"
            ]
            [ text user.name ]
        , img
            [ class "img-profile rounded-circle"
            , style "width" "2.4rem"
            , style "height" "2.4rem"
            , style "margin-bottom" ".1rem"
            , src "/tmp/photo-1518822275865-16eec4d3023d.jpeg"
            ]
            []
        ]
