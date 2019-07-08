module Table.Projects exposing (view)

import Bootstrap.Button as Button
import Bootstrap.Table as Table
import Bootstrap.Utilities.Spacing as Spacing
import Data.Project exposing (Project)
import Helpers.Table
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


view : String -> List Project -> (Project -> msg1) -> (msg1 -> msg) -> Html msg
view searchQuery projects select toMsg =
    let
        tableRow project =
            Table.tr []
                [ Table.td []
                    [ Button.button
                        [ Button.roleLink
                        , Button.attrs
                            [ onClick (toMsg (select project))
                            , Spacing.p0
                            ]
                        ]
                        [ Helpers.Table.highlightQuery searchQuery project.name
                        ]
                    ]
                , Table.td [] [ text "Today" ]
                , Table.td [] [ text project.country ]
                ]
    in
    if List.isEmpty projects then
        h6 [] [ text "No projects found." ]

    else
        Table.table
            { options = [ Table.attr (class "m-0"), Table.small ]
            , thead =
                Table.simpleThead
                    [ Table.th [ Table.cellAttr (class "w-50") ] [ text "Project name" ]
                    , Table.th [ Table.cellAttr (class "w-40") ] [ text "Last accessed" ]
                    , Table.th [ Table.cellAttr (class "w-10") ] [ text "Country" ]
                    ]
            , tbody = Table.tbody [] (List.map tableRow projects)
            }
