module Table.Content.Text exposing (view)

import Bootstrap.Button as Button
import Bootstrap.Table as Table
import Bootstrap.Utilities.Spacing as Spacing
import Data.Content.Text exposing (Text)
import Helpers.Table
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


view : String -> List Text -> Html msg
view searchQuery items =
    let
        tableRow { id, title } =
            Table.tr []
                [ Table.td [] [ text (String.fromInt id) ]
                , Table.td [] [ a [ href "#" ] [ Helpers.Table.highlightQuery searchQuery title ] ]
                ]
    in
    if List.isEmpty items then
        h6 [] [ text "No audio found." ]

    else
        Table.table
            { options = [ Table.bordered, Table.small ]
            , thead =
                Table.simpleThead
                    [ Table.th [] [ text "Id" ]
                    , Table.th [ Table.cellAttr (class "w-50") ] [ text "Title" ]
                    ]
            , tbody = Table.tbody [] (List.map tableRow items)
            }
