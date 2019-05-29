module Data.Notification exposing (Notification, decoder, encoder)

import Json.Decode as Json
import Json.Encode exposing (Value, object)


type alias Notification =
    { id : Int
    , message : String
    , time : Int
    }


decoder : Json.Decoder Notification
decoder =
    Json.map3 Notification
        (Json.field "id" Json.int)
        (Json.field "message" Json.string)
        (Json.field "time" Json.int)


encoder : Notification -> Value
encoder { id, message, time } =
    object
        [ ( "id", Json.Encode.int id )
        , ( "message", Json.Encode.string message )
        , ( "time", Json.Encode.int time )
        ]
