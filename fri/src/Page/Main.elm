module Page.Main exposing (Msg(..), Page(..))

import Page.Main.Apps as Apps
import Page.Main.Audience as Audience
import Page.Main.Dashboard as Dashboard
import Page.Main.ListenerAudio as ListenerAudio
import Page.Main.Notifications as Notifications


type Msg
    = DashboardMsg Dashboard.Msg
    | AppsPageMsg Apps.Msg
    | AudiencePageMsg Audience.Msg
    | ListenerAudioPageMsg ListenerAudio.Msg
    | NotificationsPageMsg Notifications.Msg


type Page
    = Dashboard Dashboard.State
    | AppsPage Apps.State
    | AudiencePage Audience.State
    | ListenerAudioPage ListenerAudio.State
    | NotificationsPage Notifications.State
