module Page.Projects exposing (Msg(..), Page(..))

import Page.Projects.Create
import Page.Projects.Select
import Page.Projects.Settings


type Msg
    = CreateProjectPageMsg Page.Projects.Create.Msg
    | SelectProjectPageMsg Page.Projects.Select.Msg
    | ProjectSettingsPageMsg Page.Projects.Settings.Msg


type Page
    = CreateProjectPage Page.Projects.Create.State
    | SelectProjectPage Page.Projects.Select.State
    | ProjectSettingsPage Page.Projects.Settings.State
