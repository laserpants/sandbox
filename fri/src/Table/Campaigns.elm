module Table.Campaigns exposing (view)

import Bootstrap.Table as Table
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


view : Html msg
view =
    div []
        [ Table.table
            { options = [ Table.bordered, Table.small ]
            , thead =
                Table.simpleThead
                    [ Table.th [] [ text "Name" ]
                    , Table.th [] [ text "Status" ]
                    , Table.th [] [ text "Segments" ]
                    ]
            , tbody =
                Table.tbody []
                    [ Table.tr []
                        [ Table.td [] [ a [ href "#" ] [ text "Hello" ] ]
                        , Table.td [] [ text "Active" ]
                        , Table.td [] [ text "Hello" ]
                        ]
                    , Table.tr []
                        [ Table.td [] [ a [ href "#" ] [ text "Hello" ] ]
                        , Table.td [] [ text "Active" ]
                        , Table.td [] [ text "There" ]
                        ]
                    , Table.tr []
                        [ Table.td [] [ a [ href "#" ] [ text "Hello" ] ]
                        , Table.td [] [ text "Inactive" ]
                        , Table.td [] [ text "Dude" ]
                        ]
                    ]
            }
        , nav []
            [ ul [ class "pagination pagination-sm" ]
                [ li [ class "page-item" ]
                    [ a [ href "#", class "page-link" ] [ text "Previous" ] ]
                , li [ class "page-item" ]
                    [ a [ href "#", class "page-link" ] [ text "1" ] ]
                , li [ class "page-item" ]
                    [ a [ href "#", class "page-link" ] [ text "2" ] ]
                , li [ class "page-item" ]
                    [ a [ href "#", class "page-link" ] [ text "3" ] ]
                , li [ class "page-item" ]
                    [ a [ href "#", class "page-link" ] [ text "Next" ] ]
                ]
            ]
        ]
