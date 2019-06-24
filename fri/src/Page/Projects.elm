module Page.Projects exposing (Msg(..), Page(..))

import Page.Projects.Create as CreateProject
import Page.Projects.Select as SelectProject
import Page.Projects.Settings as ProjectSettings


type Msg
    = CreateProjectPageMsg CreateProject.Msg
    | SelectProjectPageMsg SelectProject.Msg
    | ProjectSettingsPageMsg ProjectSettings.Msg


type Page
    = CreateProjectPage CreateProject.State
    | SelectProjectPage SelectProject.State
    | ProjectSettingsPage ProjectSettings.State
