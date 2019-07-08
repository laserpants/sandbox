module Data.Listener exposing (Listener, decoder)

import Json.Decode as Json exposing (field, int, list, maybe, string)


type alias Listener =
    { id : Int
    , name : String
    }


decoder : Json.Decoder Listener
decoder =
    Json.map2 Listener
        (field "id" int)
        (field "name" string)
