module Websocket.SearchProjects exposing (Message, decoder, encodeQuery)

import Data.Project as Project exposing (Project)
import Json.Decode as Json exposing (field, list, string)
import Json.Encode as Encode


type alias Message =
    { query : String
    , results : List Project
    }


decoder : Json.Decoder Message
decoder =
    Json.map2 Message
        (field "query" string)
        (field "results" (list Project.decoder))


encodeQuery : String -> Json.Value
encodeQuery query =
    Encode.object
        [ ( "type", Encode.string "projects_search_query" )
        , ( "query", Encode.string query )
        ]
