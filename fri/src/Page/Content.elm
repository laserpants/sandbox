module Page.Content exposing (Msg(..), Page(..))

import Page.Content.Audio.Archive as AudioArchive
import Page.Content.Audio.Upload as UploadAudio
import Page.Content.Text.Archive as TextArchive
import Page.Content.Text.Create as CreateText


type Msg
    = AudioArchivePageMsg AudioArchive.Msg
    | UploadAudioPageMsg UploadAudio.Msg
    | TextArchivePageMsg TextArchive.Msg
    | CreateTextPageMsg CreateText.Msg


type Page
    = AudioArchivePage AudioArchive.State
    | UploadAudioPage UploadAudio.State
    | TextArchivePage TextArchive.State
    | CreateTextPage CreateText.State
