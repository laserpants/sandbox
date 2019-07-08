module Table.ListenerAudio exposing (view)

import Bootstrap.Button as Button
import Bootstrap.Table as Table
import Bootstrap.Utilities.Spacing as Spacing
import Data.ListenerAudio exposing (ListenerAudio)
import Helpers.Table
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


view : String -> List ListenerAudio -> Html msg
view searchQuery items =
    let
        tableRow { id, phoneNumber } =
            Table.tr []
                [ Table.td [] [ text (String.fromInt id) ]
                , Table.td [] [ a [ href "#" ] [ Helpers.Table.highlightQuery searchQuery phoneNumber ] ]
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
                    , Table.th [ Table.cellAttr (class "w-50") ] [ text "Phone number" ]
                    ]
            , tbody = Table.tbody [] (List.map tableRow items)
            }
