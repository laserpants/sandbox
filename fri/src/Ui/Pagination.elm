module Ui.Pagination exposing (nav, table)

import Helpers.Api exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Ui.Spinner exposing (spinner)
import Update.Deep.Api as Api exposing (Resource(..))
import Update.Deep.Pagination as Pagination
import Websocket


nav : Int -> Int -> { previous : msg, next : msg, gotoPage : Int -> msg } -> Html msg
nav pages currentPage { previous, next, gotoPage } =
    let
        pageLink page =
            li
                [ class
                    ("page-item"
                        ++ (if page == currentPage then
                                " active"

                            else
                                ""
                           )
                    )
                ]
                [ button [ onClick (gotoPage page), class "page-link" ] [ text (String.fromInt page) ] ]
    in
    Html.nav []
        [ ul [ class "pagination pagination-sm" ]
            ([ li
                [ class
                    ("page-item"
                        ++ (if currentPage < 2 then
                                " disabled"

                            else
                                ""
                           )
                    )
                ]
                [ button [ onClick previous, class "page-link" ] [ text "Previous" ] ]
             ]
                ++ List.map pageLink (List.range 1 pages)
                ++ [ li
                        [ class
                            ("page-item"
                                ++ (if currentPage >= pages then
                                        " disabled"

                                    else
                                        ""
                                   )
                            )
                        ]
                        [ button [ onClick next, class "page-link" ] [ text "Next" ] ]
                   ]
            )
        ]


table : Pagination.State a -> Websocket.Search a -> (String -> List a -> Html msg) -> (Pagination.Msg a -> msg) -> Html msg
table { api, current, pages } { query, results } table_ toMsg =
    case api.resource of
        NotRequested ->
            text ""

        Requested ->
            spinner

        Error httpError ->
            resourceErrorMessage api.resource

        Available { page } ->
            div []
                (if not (String.isEmpty query) then
                    [ if not (List.isEmpty results) then
                        h6 [] [ text "Search results" ]

                      else
                        text ""
                    ]
                        ++ [ table_ query results
                           ]

                 else
                    [ h6 [] [ text ("Showing results " ++ String.fromInt current ++ " to " ++ String.fromInt pages) ]
                    , table_ "" page
                    , nav pages
                        current
                        { previous = toMsg Pagination.Previous
                        , next = toMsg Pagination.Next
                        , gotoPage = toMsg << Pagination.Goto
                        }
                    ]
                )
