module Data.Content.Text exposing (Text, decoder)

import Json.Decode as Json exposing (field, int, list, maybe, string)


type alias Text =
    { id : Int
    , title : String
    }


decoder : Json.Decoder Text
decoder =
    Json.map2 Text
        (field "id" int)
        (field "title" string)
