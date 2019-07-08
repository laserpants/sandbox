module Websocket.Search exposing (Results, decoder, encodeSearchQuery, initial)

import Json.Decode as Json exposing (field, list, string)
import Json.Encode as Encode


type alias Results a =
    { query : String
    , results : List a
    }


initial : Results a
initial =
    { query = "", results = [] }


decoder : Json.Decoder a -> Json.Decoder (Results a)
decoder itemDecoder =
    Json.map2 Results
        (field "query" string)
        (field "results" (list itemDecoder))


encodeSearchQuery : String -> String -> Json.Value
encodeSearchQuery resource query =
    Encode.object
        [ ( "type", Encode.string (resource ++ "_search_query") )
        , ( "query", Encode.string query )
        ]
