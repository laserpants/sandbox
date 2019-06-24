module Data.Project exposing (Project, decoder)

import Json.Decode as Json exposing (field, int, list, string)


type alias Project =
    { id : Int
    , name : String
    , country : String
    }


decoder : Json.Decoder Project
decoder =
    Json.map3 Project
        (field "id" int)
        (field "name" string)
        (field "country" string)
