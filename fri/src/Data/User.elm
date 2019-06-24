module Data.User exposing (User, decoder)

import Json.Decode as Json exposing (bool, field, int, list, maybe, string)


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
        (field "id" int)
        (field "email" string)
        (field "login" string)
        (field "name" string)
        (field "organization" (maybe string))
        (field "phoneNumber" (maybe string))
        (field "country" string)
        (field "rememberMe" bool)
