module Data.User exposing (User, decoder)

import Json.Decode as Json


type alias User =
    { id : Int
    , email : String
    , login : String
    , name : String
    , organization : Maybe String
    , phoneNumber : Maybe String
    , country : String
    , rememberMe : Bool
    }


decoder : Json.Decoder User
decoder =
    Json.map8 User
        (Json.field "id" Json.int)
        (Json.field "email" Json.string)
        (Json.field "login" Json.string)
        (Json.field "name" Json.string)
        (Json.field "organization" (Json.maybe Json.string))
        (Json.field "phoneNumber" (Json.maybe Json.string))
        (Json.field "country" Json.string)
        (Json.field "rememberMe" Json.bool)
