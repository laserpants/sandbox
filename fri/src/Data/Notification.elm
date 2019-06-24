module Data.Notification exposing (Notification, decoder)

import Json.Decode as Json exposing (field, int, list, string)



--import Json.Encode exposing (Value, object)


type alias Notification =
    { id : Int
    , message : String
    , time : Int
    }


decoder : Json.Decoder Notification
decoder =
    Json.map3 Notification
        (field "id" int)
        (field "message" string)
        (field "time" int)



--encoder : Notification -> Value
--encoder { id, message, time } =
--    object
--        [ ( "id", Json.Encode.int id )
--        , ( "message", Json.Encode.string message )
--        , ( "time", Json.Encode.int time )
--        ]
