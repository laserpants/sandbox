module Websocket.LoginAvailable exposing (Message, decoder, encodeQuery)

import Json.Decode as Json exposing (bool, field, string)
import Json.Encode as Encode


type alias Message =
    { login : String
    , available : Bool
    }


decoder : Json.Decoder Message
decoder =
    Json.map2 Message
        (field "login" string)
        (field "available" bool)


encodeQuery : String -> Json.Value
encodeQuery login =
    Encode.object
        [ ( "type", Encode.string "login_available_query" )
        , ( "login", Encode.string login )
        ]
