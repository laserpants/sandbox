module Ui.Gdpr exposing (banner)

import Css exposing (..)
import Html exposing (Html)
import Html.Styled exposing (div, fromUnstyled, span, text, toUnstyled)
import Html.Styled.Attributes exposing (attribute, class, css)


banner : List (Html msg) -> Html msg
banner elements =
    div
        [ css
            [ position fixed
            , backgroundColor (rgba 0 0 0 0.8)
            , bottom (px 0)
            , padding (em 1)
            ]
        ]
        (List.map fromUnstyled elements)
        |> toUnstyled
