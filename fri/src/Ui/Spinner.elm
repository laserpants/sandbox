module Ui.Spinner exposing (navbarSpinner, spinner)

import Css exposing (..)
import Html exposing (Html)
import Html.Styled exposing (div, span, text, toUnstyled)
import Html.Styled.Attributes exposing (attribute, class, css)


navbarSpinner : Html msg
navbarSpinner =
    div
        [ class "d-flex justify-content-center"
        , css
            [ alignItems center
            ]
        ]
        [ div
            [ class "spinner-border text-white"
            , attribute "role" "status"
            , css
                [ borderWidth (px 5)
                , width (rem 2)
                , height (rem 2)
                , opacity (num 0.85)
                ]
            ]
            [ span [ class "sr-only" ] [ text "Loading" ]
            ]
        ]
        |> toUnstyled


spinner : Html msg
spinner =
    div [ css [ padding (em 2.5) ] ]
        [ div [ class "d-flex justify-content-center" ]
            [ div
                [ class "spinner-border text-primary"
                , attribute "role" "status"
                , css
                    [ borderWidth (px 6)
                    , width (rem 3.5)
                    , height (rem 3.5)
                    ]
                ]
                [ span [ class "sr-only" ] [ text "Loading" ]
                ]
            ]
        ]
        |> toUnstyled
