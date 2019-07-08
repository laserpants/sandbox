module Page.Content exposing (Msg(..), Page(..))

import Page.Content.Audio.Archive
import Page.Content.Audio.Upload
import Page.Content.Text.Archive
import Page.Content.Text.Create


type Msg
    = AudioArchivePageMsg Page.Content.Audio.Archive.Msg
    | UploadAudioPageMsg Page.Content.Audio.Upload.Msg
    | TextArchivePageMsg Page.Content.Text.Archive.Msg
    | CreateTextPageMsg Page.Content.Text.Create.Msg


type Page
    = AudioArchivePage Page.Content.Audio.Archive.State
    | UploadAudioPage Page.Content.Audio.Upload.State
    | TextArchivePage Page.Content.Text.Archive.State
    | CreateTextPage Page.Content.Text.Create.State
