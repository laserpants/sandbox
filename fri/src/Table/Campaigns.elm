module Table.Campaigns exposing (view)

import Bootstrap.Table as Table
import Data.Campaign exposing (Campaign)
import Helpers.Table
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Ui.Pagination


view : String -> List Campaign -> Html msg
view searchQuery campaigns =
    let
        tableRow { id, name } =
            Table.tr []
                [ Table.td [] [ text (String.fromInt id) ]
                , Table.td [] [ a [ href ("/campaigns/" ++ String.fromInt id) ] [ Helpers.Table.highlightQuery searchQuery name ] ]
                , Table.td [] [ text "Hello" ]
                , Table.td [] [ text "Hello" ]
                ]
    in
    if List.isEmpty campaigns then
        h6 [] [ text "Nothing to show" ]

    else
        Table.table
            { options = [ Table.bordered, Table.small ]
            , thead =
                Table.simpleThead
                    [ Table.th [] [ text "Id" ]
                    , Table.th [] [ text "Name" ]
                    , Table.th [] [ text "Status" ]
                    , Table.th [] [ text "Segments" ]
                    ]
            , tbody = Table.tbody [] (List.map tableRow campaigns)
            }
