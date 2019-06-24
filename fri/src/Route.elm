module Route exposing (Route(..), fromUrl, parser)

import Url exposing (Url)
import Url.Parser exposing ((</>), Parser, int, map, oneOf, parse, s, top)


type Route
    = Home
    | Login
    | Logout
    | ResetPassword
    | Register
    | Profile
    | Projects
    | NewProject
    | Settings
    | Notifications
    | ActiveCampaigns
    | InactiveCampaigns
    | AllCampaigns
    | NewCampaign
    | ManageNumbers
    | Routing
    | Audience
    | AudioArchive
    | UploadAudio
    | MessageArchive
    | CreateMessage
    | PollResults
    | Answers
    | Cost
    | Analytics
    | ListenerAudio
    | Apps


parser : Parser (Route -> a) a
parser =
    oneOf
        [ map Home top
        , map Login (s "login")
        , map Logout (s "logout")
        , map ResetPassword (s "reset-password")
        , map Register (s "register")
        , map Profile (s "profile")
        , map Settings (s "settings")
        , map Projects (s "projects")
        , map NewProject (s "projects" </> s "new")
        , map Notifications (s "notifications")
        , map ActiveCampaigns (s "campaigns" </> s "active")
        , map InactiveCampaigns (s "campaigns" </> s "inactive")
        , map AllCampaigns (s "campaigns" </> s "all")
        , map NewCampaign (s "campaigns" </> s "new")
        , map ManageNumbers (s "numbers" </> s "manage")
        , map Routing (s "numbers" </> s "routing")
        , map Audience (s "audience")
        , map AudioArchive (s "content" </> s "audio" </> s "archive")
        , map UploadAudio (s "content" </> s "audio" </> s "upload")
        , map MessageArchive (s "content" </> s "text" </> s "archive")
        , map CreateMessage (s "content" </> s "text" </> s "create")
        , map PollResults (s "results" </> s "polls")
        , map Answers (s "results" </> s "answers")
        , map Cost (s "results" </> s "cost")
        , map Analytics (s "results" </> s "analytics")
        , map ListenerAudio (s "audio")
        , map Apps (s "apps")
        ]


fromUrl : Url -> Maybe Route
fromUrl =
    parse parser
