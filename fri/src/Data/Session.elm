module Data.Session exposing (Session, decoder)

import Data.Notification exposing (Notification)
import Data.Project exposing (Project)
import Data.User exposing (User)
import Json.Decode as Json


type alias Session =
    { user : User
    , project : Maybe Project
    , notifications : List Notification
    }


decoder : Json.Decoder Session
decoder =
    Json.map3 Session
        (Json.field "user" Data.User.decoder)
        (Json.maybe (Json.field "project" Data.Project.decoder))
        (Json.field "notifications" (Json.list Data.Notification.decoder))
