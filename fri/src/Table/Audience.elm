module Table.Audience exposing (view)

import Bootstrap.Table as Table
import Data.Listener exposing (Listener)
import Helpers.Table
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


view : String -> List Listener -> Html msg
view searchQuery listeners =
    let
        tableRow { id, name } =
            Table.tr []
                [ Table.td [] [ text (String.fromInt id) ]
                , Table.td [] [ a [ href "#" ] [ Helpers.Table.highlightQuery searchQuery name ] ]
                ]
    in
    if List.isEmpty listeners then
        h6 [] [ text "Nothing to show" ]

    else
        Table.table
            { options = [ Table.bordered, Table.small ]
            , thead =
                Table.simpleThead
                    [ Table.th [] [ text "Id" ]
                    , Table.th [] [ text "Name" ]
                    ]
            , tbody = Table.tbody [] (List.map tableRow listeners)
            }
