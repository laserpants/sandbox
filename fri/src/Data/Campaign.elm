module Data.Campaign exposing (Campaign, decoder)

import Json.Decode as Json exposing (field, int, list, maybe, string)


type alias Campaign =
    { id : Int
    , name : String
    , description : Maybe String
    }


decoder : Json.Decoder Campaign
decoder =
    Json.map3 Campaign
        (field "id" int)
        (field "name" string)
        (field "description" (maybe string))
