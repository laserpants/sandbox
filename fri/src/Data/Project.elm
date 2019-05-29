module Data.Project exposing (Project, decoder)

import Json.Decode as Json


type alias Project =
    { id : Int
    , name : String
    , country : String
    }


decoder : Json.Decoder Project
decoder =
    Json.map3 Project
        (Json.field "id" Json.int)
        (Json.field "name" Json.string)
        (Json.field "country" Json.string)
