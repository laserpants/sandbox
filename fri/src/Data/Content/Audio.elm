module Data.Content.Audio exposing (Audio, decoder)

import Json.Decode as Json exposing (field, int, list, maybe, string)


type alias Audio =
    { id : Int
    , title : String
    }


decoder : Json.Decoder Audio
decoder =
    Json.map2 Audio
        (field "id" int)
        (field "title" string)
