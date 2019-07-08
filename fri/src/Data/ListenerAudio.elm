module Data.ListenerAudio exposing (ListenerAudio, decoder)

import Json.Decode as Json exposing (field, int, list, maybe, string)


type alias ListenerAudio =
    { id : Int
    , phoneNumber : String
    }


decoder : Json.Decoder ListenerAudio
decoder =
    Json.map2 ListenerAudio
        (field "id" int)
        (field "phoneNumber" string)
