module Data.Session exposing (Session, decoder)

import Data.Notification as Notification exposing (Notification)
import Data.Project as Project exposing (Project)
import Data.User as User exposing (User)
import Json.Decode as Json exposing (field, int, list, maybe, string)


type alias Session =
    { user : User
    , project : Maybe Project
    , notifications : List Notification
    , locale : String
    }


decoder : Json.Decoder Session
decoder =
    Json.map4 Session
        (field "user" User.decoder)
        (maybe (field "project" Project.decoder))
        (field "notifications" (list Notification.decoder))
        (field "locale" string)
