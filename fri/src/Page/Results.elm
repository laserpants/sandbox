module Page.Results exposing (Msg(..), Page(..))

import Page.Results.Analytics as Analytics
import Page.Results.Answers as Answers
import Page.Results.Cost as Cost
import Page.Results.Polls as Polls


type Msg
    = AnalyticsPageMsg Analytics.Msg
    | AnswersPageMsg Answers.Msg
    | PollResultsPageMsg Polls.Msg
    | CostPageMsg Cost.Msg


type Page
    = AnalyticsPage Analytics.State
    | AnswersPage Answers.State
    | PollResultsPage Polls.State
    | CostPage Cost.State
