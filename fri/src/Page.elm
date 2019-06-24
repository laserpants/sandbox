module Page exposing (Msg(..), Page(..), current, fromRoute, subscriptions, title, update, view)

import Bootstrap.Grid.Col as Col
import Data.Project exposing (Project)
import Data.Session exposing (Session)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Page.Campaigns as Campaigns
import Page.Campaigns.Active
import Page.Campaigns.All
import Page.Campaigns.Create
import Page.Campaigns.Inactive
import Page.Campaigns.Numbers
import Page.Campaigns.Routing
import Page.Content as Content
import Page.Content.Audio.Archive
import Page.Content.Audio.Upload
import Page.Content.Text.Archive
import Page.Content.Text.Create
import Page.Main as Main
import Page.Main.Apps
import Page.Main.Audience
import Page.Main.Dashboard
import Page.Main.ListenerAudio
import Page.Main.Notifications
import Page.Projects as Projects
import Page.Projects.Create
import Page.Projects.Select
import Page.Projects.Settings
import Page.Results as Results
import Page.Results.Analytics
import Page.Results.Answers
import Page.Results.Cost
import Page.Results.Polls
import Page.User as User
import Page.User.Login
import Page.User.Profile
import Page.User.Register
import Page.User.ResetPassword
import Route exposing (Route(..))
import Ui
import Update.Deep exposing (..)


type Msg
    = MainPageMsg Main.Msg
    | UserPageMsg User.Msg
    | CampaignsPageMsg Campaigns.Msg
    | ContentPageMsg Content.Msg
    | ProjectsPageMsg Projects.Msg
    | ResultsPageMsg Results.Msg


type Page
    = NotFoundPage
    | MainPage Main.Page
    | UserPage User.Page
    | CampaignsPage Campaigns.Page
    | ContentPage Content.Page
    | ProjectsPage Projects.Page
    | ResultsPage Results.Page


current :
    Page
    ->
        { isAppsPage : Bool
        , isAudiencePage : Bool
        , isActiveCampaignsPage : Bool
        , isAllCampaignsPage : Bool
        , isCreateCampaignPage : Bool
        , isInactiveCampaignsPage : Bool
        , isCampaignsManageNumbersPage : Bool
        , isCampaignsRoutingPage : Bool
        , isAudioArchivePage : Bool
        , isCreateTextPage : Bool
        , isTextArchivePage : Bool
        , isUploadAudioPage : Bool
        , isDashboardPage : Bool
        , isListenerAudioPage : Bool
        , isNotFoundPage : Bool
        , isNotificationsPage : Bool
        , isCreateProjectPage : Bool
        , isProjectSettingsPage : Bool
        , isSelectProjectPage : Bool
        , isResultsAnalyticsPage : Bool
        , isResultsAnswersPage : Bool
        , isResultsCostPage : Bool
        , isPollResultsPage : Bool
        , isUserLoginPage : Bool
        , isUserProfilePage : Bool
        , isUserRegisterPage : Bool
        , isUserResetPasswordPage : Bool
        }
current page =
    let
        none =
            { isNotFoundPage = False
            , isDashboardPage = False
            , isAppsPage = False
            , isAudiencePage = False
            , isListenerAudioPage = False
            , isNotificationsPage = False
            , isUserLoginPage = False
            , isUserRegisterPage = False
            , isUserProfilePage = False
            , isUserResetPasswordPage = False
            , isActiveCampaignsPage = False
            , isInactiveCampaignsPage = False
            , isAllCampaignsPage = False
            , isCreateCampaignPage = False
            , isCampaignsManageNumbersPage = False
            , isCampaignsRoutingPage = False
            , isAudioArchivePage = False
            , isUploadAudioPage = False
            , isTextArchivePage = False
            , isCreateTextPage = False
            , isCreateProjectPage = False
            , isSelectProjectPage = False
            , isProjectSettingsPage = False
            , isResultsAnalyticsPage = False
            , isResultsAnswersPage = False
            , isPollResultsPage = False
            , isResultsCostPage = False
            }
    in
    case page of
        NotFoundPage ->
            { none | isNotFoundPage = True }

        MainPage mainPage ->
            case mainPage of
                Main.Dashboard _ ->
                    { none | isDashboardPage = True }

                Main.AppsPage _ ->
                    { none | isAppsPage = True }

                Main.AudiencePage _ ->
                    { none | isAudiencePage = True }

                Main.ListenerAudioPage _ ->
                    { none | isListenerAudioPage = True }

                Main.NotificationsPage _ ->
                    { none | isNotFoundPage = True }

        UserPage userPage ->
            case userPage of
                User.LoginPage _ ->
                    { none | isUserLoginPage = True }

                User.RegisterPage _ ->
                    { none | isUserRegisterPage = True }

                User.ProfilePage _ ->
                    { none | isUserProfilePage = True }

                User.ResetPasswordPage _ ->
                    { none | isUserRegisterPage = True }

        CampaignsPage campaignsPage ->
            case campaignsPage of
                Campaigns.ActiveCampaignsPage _ ->
                    { none | isActiveCampaignsPage = True }

                Campaigns.InactiveCampaignsPage _ ->
                    { none | isInactiveCampaignsPage = True }

                Campaigns.AllCampaignsPage _ ->
                    { none | isAllCampaignsPage = True }

                Campaigns.CreateCampaignPage _ ->
                    { none | isCreateCampaignPage = True }

                Campaigns.ManageNumbersPage _ ->
                    { none | isCampaignsManageNumbersPage = True }

                Campaigns.RoutingPage _ ->
                    { none | isCampaignsRoutingPage = True }

        ContentPage contentPage ->
            case contentPage of
                Content.AudioArchivePage _ ->
                    { none | isAudioArchivePage = True }

                Content.UploadAudioPage _ ->
                    { none | isUploadAudioPage = True }

                Content.TextArchivePage _ ->
                    { none | isTextArchivePage = True }

                Content.CreateTextPage _ ->
                    { none | isCreateTextPage = True }

        ProjectsPage projectsPage ->
            case projectsPage of
                Projects.CreateProjectPage _ ->
                    { none | isCreateProjectPage = True }

                Projects.SelectProjectPage _ ->
                    { none | isSelectProjectPage = True }

                Projects.ProjectSettingsPage _ ->
                    { none | isProjectSettingsPage = True }

        ResultsPage resultsPage ->
            case resultsPage of
                Results.AnalyticsPage _ ->
                    { none | isResultsAnalyticsPage = True }

                Results.AnswersPage _ ->
                    { none | isResultsAnswersPage = True }

                Results.PollResultsPage _ ->
                    { none | isPollResultsPage = True }

                Results.CostPage _ ->
                    { none | isResultsCostPage = True }


update : { onAuthResponse : Maybe Session -> a, onProjectSelected : Project -> a } -> Msg -> (Msg -> msg) -> Page -> Update Page msg a
update { onAuthResponse, onProjectSelected } msg toMsg page =
    case ( page, msg ) of
        ( NotFoundPage, _ ) ->
            save page

        ( MainPage mainPage, MainPageMsg mainPageMsg ) ->
            case ( mainPage, mainPageMsg ) of
                ( Main.Dashboard dashboardState, Main.DashboardMsg dashboardMsg ) ->
                    dashboardState
                        |> Page.Main.Dashboard.update dashboardMsg (toMsg << MainPageMsg << Main.DashboardMsg)
                        |> Update.Deep.map (MainPage << Main.Dashboard)

                ( Main.AppsPage appsPageState, Main.AppsPageMsg appsPageMsg ) ->
                    appsPageState
                        |> Page.Main.Apps.update appsPageMsg (toMsg << MainPageMsg << Main.AppsPageMsg)
                        |> Update.Deep.map (MainPage << Main.AppsPage)

                ( Main.AudiencePage audiencePageState, Main.AudiencePageMsg audiencePageMsg ) ->
                    audiencePageState
                        |> Page.Main.Audience.update audiencePageMsg (toMsg << MainPageMsg << Main.AudiencePageMsg)
                        |> Update.Deep.map (MainPage << Main.AudiencePage)

                ( Main.ListenerAudioPage listenerAudioPageState, Main.ListenerAudioPageMsg listenerAudioPageMsg ) ->
                    listenerAudioPageState
                        |> Page.Main.ListenerAudio.update listenerAudioPageMsg (toMsg << MainPageMsg << Main.ListenerAudioPageMsg)
                        |> Update.Deep.map (MainPage << Main.ListenerAudioPage)

                ( Main.NotificationsPage notificationsPageState, Main.NotificationsPageMsg notificationsPageMsg ) ->
                    notificationsPageState
                        |> Page.Main.Notifications.update notificationsPageMsg (toMsg << MainPageMsg << Main.NotificationsPageMsg)
                        |> Update.Deep.map (MainPage << Main.NotificationsPage)

                _ ->
                    save page

        ( UserPage userPage, UserPageMsg userPageMsg ) ->
            case ( userPage, userPageMsg ) of
                ( User.LoginPage loginPageState, User.LoginPageMsg loginPageMsg ) ->
                    loginPageState
                        |> Page.User.Login.update { onAuthResponse = onAuthResponse } loginPageMsg (toMsg << UserPageMsg << User.LoginPageMsg)
                        |> Update.Deep.map (UserPage << User.LoginPage)

                ( User.RegisterPage registerPageState, User.RegisterPageMsg registerPageMsg ) ->
                    registerPageState
                        |> Page.User.Register.update registerPageMsg (toMsg << UserPageMsg << User.RegisterPageMsg)
                        |> Update.Deep.map (UserPage << User.RegisterPage)

                ( User.ProfilePage profilePageState, User.ProfilePageMsg profilePageMsg ) ->
                    profilePageState
                        |> Page.User.Profile.update profilePageMsg (toMsg << UserPageMsg << User.ProfilePageMsg)
                        |> Update.Deep.map (UserPage << User.ProfilePage)

                ( User.ResetPasswordPage resetPasswordPageState, User.ResetPasswordPageMsg resetPasswordPageMsg ) ->
                    resetPasswordPageState
                        |> Page.User.ResetPassword.update resetPasswordPageMsg (toMsg << UserPageMsg << User.ResetPasswordPageMsg)
                        |> Update.Deep.map (UserPage << User.ResetPasswordPage)

                _ ->
                    save page

        ( CampaignsPage campaignsPage, CampaignsPageMsg campaignsPageMsg ) ->
            case ( campaignsPage, campaignsPageMsg ) of
                ( Campaigns.ActiveCampaignsPage activeCampaignsPageState, Campaigns.ActiveCampaignsPageMsg activeCampaignsPageMsg ) ->
                    activeCampaignsPageState
                        |> Page.Campaigns.Active.update activeCampaignsPageMsg (toMsg << CampaignsPageMsg << Campaigns.ActiveCampaignsPageMsg)
                        |> Update.Deep.map (CampaignsPage << Campaigns.ActiveCampaignsPage)

                ( Campaigns.InactiveCampaignsPage inactiveCampaignsPageState, Campaigns.InactiveCampaignsPageMsg inactiveCampaignsPageMsg ) ->
                    inactiveCampaignsPageState
                        |> Page.Campaigns.Inactive.update inactiveCampaignsPageMsg (toMsg << CampaignsPageMsg << Campaigns.InactiveCampaignsPageMsg)
                        |> Update.Deep.map (CampaignsPage << Campaigns.InactiveCampaignsPage)

                ( Campaigns.AllCampaignsPage allCampaignsPageState, Campaigns.AllCampaignsPageMsg allCampaignsPageMsg ) ->
                    allCampaignsPageState
                        |> Page.Campaigns.All.update allCampaignsPageMsg (toMsg << CampaignsPageMsg << Campaigns.AllCampaignsPageMsg)
                        |> Update.Deep.map (CampaignsPage << Campaigns.AllCampaignsPage)

                ( Campaigns.CreateCampaignPage createCampaignPageState, Campaigns.CreateCampaignPageMsg createCampaignPageMsg ) ->
                    createCampaignPageState
                        |> Page.Campaigns.Create.update createCampaignPageMsg (toMsg << CampaignsPageMsg << Campaigns.CreateCampaignPageMsg)
                        |> Update.Deep.map (CampaignsPage << Campaigns.CreateCampaignPage)

                ( Campaigns.ManageNumbersPage manageNumbersPageState, Campaigns.ManageNumbersPageMsg manageNumbersPageMsg ) ->
                    manageNumbersPageState
                        |> Page.Campaigns.Numbers.update manageNumbersPageMsg (toMsg << CampaignsPageMsg << Campaigns.ManageNumbersPageMsg)
                        |> Update.Deep.map (CampaignsPage << Campaigns.ManageNumbersPage)

                ( Campaigns.RoutingPage routingPageState, Campaigns.RoutingPageMsg routingPageMsg ) ->
                    routingPageState
                        |> Page.Campaigns.Routing.update routingPageMsg (toMsg << CampaignsPageMsg << Campaigns.RoutingPageMsg)
                        |> Update.Deep.map (CampaignsPage << Campaigns.RoutingPage)

                _ ->
                    save page

        ( ContentPage contentPage, ContentPageMsg contentPageMsg ) ->
            case ( contentPage, contentPageMsg ) of
                ( Content.AudioArchivePage audioArchivePageState, Content.AudioArchivePageMsg audioArchivePageMsg ) ->
                    audioArchivePageState
                        |> Page.Content.Audio.Archive.update audioArchivePageMsg (toMsg << ContentPageMsg << Content.AudioArchivePageMsg)
                        |> Update.Deep.map (ContentPage << Content.AudioArchivePage)

                ( Content.UploadAudioPage uploadAudioPageState, Content.UploadAudioPageMsg uploadAudioPageMsg ) ->
                    uploadAudioPageState
                        |> Page.Content.Audio.Upload.update uploadAudioPageMsg (toMsg << ContentPageMsg << Content.UploadAudioPageMsg)
                        |> Update.Deep.map (ContentPage << Content.UploadAudioPage)

                ( Content.TextArchivePage textArchivePageState, Content.TextArchivePageMsg textArchivePageMsg ) ->
                    textArchivePageState
                        |> Page.Content.Text.Archive.update textArchivePageMsg (toMsg << ContentPageMsg << Content.TextArchivePageMsg)
                        |> Update.Deep.map (ContentPage << Content.TextArchivePage)

                ( Content.CreateTextPage createTextPageState, Content.CreateTextPageMsg createTextPageMsg ) ->
                    createTextPageState
                        |> Page.Content.Text.Create.update createTextPageMsg (toMsg << ContentPageMsg << Content.CreateTextPageMsg)
                        |> Update.Deep.map (ContentPage << Content.CreateTextPage)

                _ ->
                    save page

        ( ProjectsPage projectsPage, ProjectsPageMsg projectsPageMsg ) ->
            case ( projectsPage, projectsPageMsg ) of
                ( Projects.CreateProjectPage createProjectPageState, Projects.CreateProjectPageMsg createProjectPageMsg ) ->
                    createProjectPageState
                        |> Page.Projects.Create.update createProjectPageMsg (toMsg << ProjectsPageMsg << Projects.CreateProjectPageMsg)
                        |> Update.Deep.map (ProjectsPage << Projects.CreateProjectPage)

                ( Projects.SelectProjectPage selectProjectPageState, Projects.SelectProjectPageMsg selectProjectPageMsg ) ->
                    selectProjectPageState
                        |> Page.Projects.Select.update { onProjectSelected = onProjectSelected } selectProjectPageMsg (toMsg << ProjectsPageMsg << Projects.SelectProjectPageMsg)
                        |> Update.Deep.map (ProjectsPage << Projects.SelectProjectPage)

                ( Projects.ProjectSettingsPage projectSettingsPageState, Projects.ProjectSettingsPageMsg projectSettingsPageMsg ) ->
                    projectSettingsPageState
                        |> Page.Projects.Settings.update projectSettingsPageMsg (toMsg << ProjectsPageMsg << Projects.ProjectSettingsPageMsg)
                        |> Update.Deep.map (ProjectsPage << Projects.ProjectSettingsPage)

                _ ->
                    save page

        ( ResultsPage resultsPage, ResultsPageMsg resultsPageMsg ) ->
            case ( resultsPage, resultsPageMsg ) of
                ( Results.AnalyticsPage analyticsPageState, Results.AnalyticsPageMsg analyticsPageMsg ) ->
                    analyticsPageState
                        |> Page.Results.Analytics.update analyticsPageMsg (toMsg << ResultsPageMsg << Results.AnalyticsPageMsg)
                        |> Update.Deep.map (ResultsPage << Results.AnalyticsPage)

                ( Results.AnswersPage answersPageState, Results.AnswersPageMsg answersPageMsg ) ->
                    answersPageState
                        |> Page.Results.Answers.update answersPageMsg (toMsg << ResultsPageMsg << Results.AnswersPageMsg)
                        |> Update.Deep.map (ResultsPage << Results.AnswersPage)

                ( Results.PollResultsPage pollResultsPageState, Results.PollResultsPageMsg pollResultsPageMsg ) ->
                    pollResultsPageState
                        |> Page.Results.Polls.update pollResultsPageMsg (toMsg << ResultsPageMsg << Results.PollResultsPageMsg)
                        |> Update.Deep.map (ResultsPage << Results.PollResultsPage)

                ( Results.CostPage costPageState, Results.CostPageMsg costPageMsg ) ->
                    costPageState
                        |> Page.Results.Cost.update costPageMsg (toMsg << ResultsPageMsg << Results.CostPageMsg)
                        |> Update.Deep.map (ResultsPage << Results.CostPage)

                _ ->
                    save page

        _ ->
            save page


subscriptions : Page -> (Msg -> msg) -> Sub msg
subscriptions page toMsg =
    case page of
        NotFoundPage ->
            Sub.none

        MainPage mainPage ->
            case mainPage of
                Main.Dashboard dashboardState ->
                    Page.Main.Dashboard.subscriptions dashboardState (toMsg << MainPageMsg << Main.DashboardMsg)

                Main.AppsPage appsPageState ->
                    Page.Main.Apps.subscriptions appsPageState (toMsg << MainPageMsg << Main.AppsPageMsg)

                Main.AudiencePage audiencePageState ->
                    Page.Main.Audience.subscriptions audiencePageState (toMsg << MainPageMsg << Main.AudiencePageMsg)

                Main.ListenerAudioPage listenerAudioPageState ->
                    Page.Main.ListenerAudio.subscriptions listenerAudioPageState (toMsg << MainPageMsg << Main.ListenerAudioPageMsg)

                Main.NotificationsPage notificationsPageState ->
                    Page.Main.Notifications.subscriptions notificationsPageState (toMsg << MainPageMsg << Main.NotificationsPageMsg)

        UserPage userPage ->
            case userPage of
                User.LoginPage loginPageState ->
                    Page.User.Login.subscriptions loginPageState (toMsg << UserPageMsg << User.LoginPageMsg)

                User.RegisterPage registerPageState ->
                    Page.User.Register.subscriptions registerPageState (toMsg << UserPageMsg << User.RegisterPageMsg)

                User.ProfilePage profilePageState ->
                    Page.User.Profile.subscriptions profilePageState (toMsg << UserPageMsg << User.ProfilePageMsg)

                User.ResetPasswordPage resetPasswordPageState ->
                    Page.User.ResetPassword.subscriptions resetPasswordPageState (toMsg << UserPageMsg << User.ResetPasswordPageMsg)

        CampaignsPage campaignsPage ->
            case campaignsPage of
                Campaigns.ActiveCampaignsPage activeCampaignsPageState ->
                    Page.Campaigns.Active.subscriptions activeCampaignsPageState (toMsg << CampaignsPageMsg << Campaigns.ActiveCampaignsPageMsg)

                Campaigns.InactiveCampaignsPage inactiveCampaignsPageState ->
                    Page.Campaigns.Inactive.subscriptions inactiveCampaignsPageState (toMsg << CampaignsPageMsg << Campaigns.InactiveCampaignsPageMsg)

                Campaigns.AllCampaignsPage allCampaignsPageState ->
                    Page.Campaigns.All.subscriptions allCampaignsPageState (toMsg << CampaignsPageMsg << Campaigns.AllCampaignsPageMsg)

                Campaigns.CreateCampaignPage createCampaignPageState ->
                    Page.Campaigns.Create.subscriptions createCampaignPageState (toMsg << CampaignsPageMsg << Campaigns.CreateCampaignPageMsg)

                Campaigns.ManageNumbersPage manageNumbersPageState ->
                    Page.Campaigns.Numbers.subscriptions manageNumbersPageState (toMsg << CampaignsPageMsg << Campaigns.ManageNumbersPageMsg)

                Campaigns.RoutingPage routingPageState ->
                    Page.Campaigns.Routing.subscriptions routingPageState (toMsg << CampaignsPageMsg << Campaigns.RoutingPageMsg)

        ContentPage contentPage ->
            case contentPage of
                Content.AudioArchivePage audioArchivePageState ->
                    Page.Content.Audio.Archive.subscriptions audioArchivePageState (toMsg << ContentPageMsg << Content.AudioArchivePageMsg)

                Content.UploadAudioPage uploadAudioPageState ->
                    Page.Content.Audio.Upload.subscriptions uploadAudioPageState (toMsg << ContentPageMsg << Content.UploadAudioPageMsg)

                Content.TextArchivePage textArchivePageState ->
                    Page.Content.Text.Archive.subscriptions textArchivePageState (toMsg << ContentPageMsg << Content.TextArchivePageMsg)

                Content.CreateTextPage createTextPageState ->
                    Page.Content.Text.Create.subscriptions createTextPageState (toMsg << ContentPageMsg << Content.CreateTextPageMsg)

        ProjectsPage projectsPage ->
            case projectsPage of
                Projects.CreateProjectPage createProjectPageState ->
                    Page.Projects.Create.subscriptions createProjectPageState (toMsg << ProjectsPageMsg << Projects.CreateProjectPageMsg)

                Projects.SelectProjectPage selectProjectPageState ->
                    Page.Projects.Select.subscriptions selectProjectPageState (toMsg << ProjectsPageMsg << Projects.SelectProjectPageMsg)

                Projects.ProjectSettingsPage projectSettingsPageState ->
                    Page.Projects.Settings.subscriptions projectSettingsPageState (toMsg << ProjectsPageMsg << Projects.ProjectSettingsPageMsg)

        ResultsPage resultsPage ->
            case resultsPage of
                Results.AnalyticsPage analyticsPageState ->
                    Page.Results.Analytics.subscriptions analyticsPageState (toMsg << ResultsPageMsg << Results.AnalyticsPageMsg)

                Results.AnswersPage answersPageState ->
                    Page.Results.Answers.subscriptions answersPageState (toMsg << ResultsPageMsg << Results.AnswersPageMsg)

                Results.PollResultsPage pollResultsPageState ->
                    Page.Results.Polls.subscriptions pollResultsPageState (toMsg << ResultsPageMsg << Results.PollResultsPageMsg)

                Results.CostPage costPageState ->
                    Page.Results.Cost.subscriptions costPageState (toMsg << ResultsPageMsg << Results.CostPageMsg)


fromRoute : Route -> Update Page Msg a
fromRoute route =
    case route of
        Logout ->
            save NotFoundPage

        ResetPassword ->
            Page.User.ResetPassword.init User.ResetPasswordPageMsg
                |> Update.Deep.map (UserPage << User.ResetPasswordPage)
                |> mapCmd UserPageMsg

        Login ->
            Page.User.Login.init User.LoginPageMsg
                |> Update.Deep.map (UserPage << User.LoginPage)
                |> mapCmd UserPageMsg

        Register ->
            Page.User.Register.init User.RegisterPageMsg
                |> Update.Deep.map (UserPage << User.RegisterPage)
                |> mapCmd UserPageMsg

        Profile ->
            Page.User.Profile.init User.ProfilePageMsg
                |> Update.Deep.map (UserPage << User.ProfilePage)
                |> mapCmd UserPageMsg

        Settings ->
            Page.Projects.Settings.init Projects.ProjectSettingsPageMsg
                |> Update.Deep.map (ProjectsPage << Projects.ProjectSettingsPage)
                |> mapCmd ProjectsPageMsg

        Projects ->
            Page.Projects.Select.init Projects.SelectProjectPageMsg
                |> Update.Deep.map (ProjectsPage << Projects.SelectProjectPage)
                |> mapCmd ProjectsPageMsg

        NewProject ->
            Page.Projects.Create.init Projects.CreateProjectPageMsg
                |> Update.Deep.map (ProjectsPage << Projects.CreateProjectPage)
                |> mapCmd ProjectsPageMsg

        Home ->
            Page.Main.Dashboard.init Main.DashboardMsg
                |> Update.Deep.map (MainPage << Main.Dashboard)
                |> mapCmd MainPageMsg

        Notifications ->
            Page.Main.Notifications.init Main.NotificationsPageMsg
                |> Update.Deep.map (MainPage << Main.NotificationsPage)
                |> mapCmd MainPageMsg

        ActiveCampaigns ->
            Page.Campaigns.Active.init Campaigns.ActiveCampaignsPageMsg
                |> Update.Deep.map (CampaignsPage << Campaigns.ActiveCampaignsPage)
                |> mapCmd CampaignsPageMsg

        InactiveCampaigns ->
            Page.Campaigns.Inactive.init Campaigns.InactiveCampaignsPageMsg
                |> Update.Deep.map (CampaignsPage << Campaigns.InactiveCampaignsPage)
                |> mapCmd CampaignsPageMsg

        AllCampaigns ->
            Page.Campaigns.All.init Campaigns.AllCampaignsPageMsg
                |> Update.Deep.map (CampaignsPage << Campaigns.AllCampaignsPage)
                |> mapCmd CampaignsPageMsg

        NewCampaign ->
            Page.Campaigns.Create.init Campaigns.CreateCampaignPageMsg
                |> Update.Deep.map (CampaignsPage << Campaigns.CreateCampaignPage)
                |> mapCmd CampaignsPageMsg

        ManageNumbers ->
            Page.Campaigns.Numbers.init Campaigns.ManageNumbersPageMsg
                |> Update.Deep.map (CampaignsPage << Campaigns.ManageNumbersPage)
                |> mapCmd CampaignsPageMsg

        Routing ->
            Page.Campaigns.Routing.init Campaigns.RoutingPageMsg
                |> Update.Deep.map (CampaignsPage << Campaigns.RoutingPage)
                |> mapCmd CampaignsPageMsg

        Audience ->
            Page.Main.Audience.init Main.AudiencePageMsg
                |> Update.Deep.map (MainPage << Main.AudiencePage)
                |> mapCmd MainPageMsg

        AudioArchive ->
            Page.Content.Audio.Archive.init Content.AudioArchivePageMsg
                |> Update.Deep.map (ContentPage << Content.AudioArchivePage)
                |> mapCmd ContentPageMsg

        UploadAudio ->
            Page.Content.Audio.Upload.init Content.UploadAudioPageMsg
                |> Update.Deep.map (ContentPage << Content.UploadAudioPage)
                |> mapCmd ContentPageMsg

        MessageArchive ->
            Page.Content.Text.Archive.init Content.TextArchivePageMsg
                |> Update.Deep.map (ContentPage << Content.TextArchivePage)
                |> mapCmd ContentPageMsg

        CreateMessage ->
            Page.Content.Text.Create.init Content.CreateTextPageMsg
                |> Update.Deep.map (ContentPage << Content.CreateTextPage)
                |> mapCmd ContentPageMsg

        PollResults ->
            Page.Results.Polls.init Results.PollResultsPageMsg
                |> Update.Deep.map (ResultsPage << Results.PollResultsPage)
                |> mapCmd ResultsPageMsg

        Answers ->
            Page.Results.Answers.init Results.AnswersPageMsg
                |> Update.Deep.map (ResultsPage << Results.AnswersPage)
                |> mapCmd ResultsPageMsg

        Cost ->
            Page.Results.Cost.init Results.CostPageMsg
                |> Update.Deep.map (ResultsPage << Results.CostPage)
                |> mapCmd ResultsPageMsg

        Analytics ->
            Page.Results.Analytics.init Results.AnalyticsPageMsg
                |> Update.Deep.map (ResultsPage << Results.AnalyticsPage)
                |> mapCmd ResultsPageMsg

        ListenerAudio ->
            Page.Main.ListenerAudio.init Main.ListenerAudioPageMsg
                |> Update.Deep.map (MainPage << Main.ListenerAudioPage)
                |> mapCmd MainPageMsg

        Apps ->
            Page.Main.Apps.init Main.AppsPageMsg
                |> Update.Deep.map (MainPage << Main.AppsPage)
                |> mapCmd MainPageMsg


view : Page -> Maybe Session -> Ui.State -> (Msg -> msg) -> (Ui.Msg -> msg) -> Html msg
view page maybeSession ui toMsg toUiMsg =
    case ( page, maybeSession ) of
        ( NotFoundPage, _ ) ->
            text "not found"

        -- TODO
        ( UserPage (User.LoginPage loginPageState), Nothing ) ->
            Ui.layout
                ui
                toUiMsg
                { colAttrs = [ Col.md10 ], bgClass = "bg-primary" }
                [ Page.User.Login.view loginPageState (toMsg << UserPageMsg << User.LoginPageMsg)
                ]

        ( UserPage (User.RegisterPage registerPageState), Nothing ) ->
            Ui.layout
                ui
                toUiMsg
                { colAttrs = [ Col.lg8, Col.xl6 ], bgClass = "bg-success" }
                [ Page.User.Register.view registerPageState (toMsg << UserPageMsg << User.RegisterPageMsg)
                ]

        ( UserPage (User.ResetPasswordPage resetPasswordPageState), Nothing ) ->
            Ui.layout
                ui
                toUiMsg
                { colAttrs = [ Col.lg6, Col.xl5 ], bgClass = "bg-primary" }
                [ Page.User.ResetPassword.view resetPasswordPageState (toMsg << UserPageMsg << User.ResetPasswordPageMsg)
                ]

        ( _, Nothing ) ->
            text ""

        ( _, Just session ) ->
            case session.project of
                Nothing ->
                    Ui.layout
                        ui
                        toUiMsg
                        { colAttrs = [ Col.md10 ], bgClass = "bg-success" }
                        [ case page of
                            ProjectsPage (Projects.CreateProjectPage createProjectPageState) ->
                                Page.Projects.Create.standaloneView createProjectPageState (toMsg << ProjectsPageMsg << Projects.CreateProjectPageMsg)

                            ProjectsPage (Projects.SelectProjectPage selectProjectPageState) ->
                                Page.Projects.Select.standaloneView selectProjectPageState (toMsg << ProjectsPageMsg << Projects.SelectProjectPageMsg)

                            UserPage (User.ProfilePage profilePageState) ->
                                Page.User.Profile.standaloneView profilePageState (toMsg << UserPageMsg << User.ProfilePageMsg)

                            _ ->
                                text ""
                        ]

                Just project ->
                    Ui.dashboardLayout
                        ui
                        session.user
                        project
                        session.locale
                        toUiMsg
                        [ case page of
                            MainPage mainPage ->
                                case mainPage of
                                    Main.Dashboard dashboardState ->
                                        Page.Main.Dashboard.view dashboardState (toMsg << MainPageMsg << Main.DashboardMsg)

                                    Main.AppsPage appsPageState ->
                                        Page.Main.Apps.view appsPageState (toMsg << MainPageMsg << Main.AppsPageMsg)

                                    Main.AudiencePage audiencePageState ->
                                        Page.Main.Audience.view audiencePageState (toMsg << MainPageMsg << Main.AudiencePageMsg)

                                    Main.ListenerAudioPage listenerAudioPageState ->
                                        Page.Main.ListenerAudio.view listenerAudioPageState (toMsg << MainPageMsg << Main.ListenerAudioPageMsg)

                                    Main.NotificationsPage notificationsPageState ->
                                        Page.Main.Notifications.view notificationsPageState (toMsg << MainPageMsg << Main.NotificationsPageMsg)

                            UserPage userPage ->
                                case userPage of
                                    User.ProfilePage profilePageState ->
                                        Page.User.Profile.dashboardView profilePageState (toMsg << UserPageMsg << User.ProfilePageMsg)

                                    _ ->
                                        text ""

                            CampaignsPage campaignsPage ->
                                case campaignsPage of
                                    Campaigns.ActiveCampaignsPage activeCampaignsPageState ->
                                        Page.Campaigns.Active.view activeCampaignsPageState (toMsg << CampaignsPageMsg << Campaigns.ActiveCampaignsPageMsg)

                                    Campaigns.InactiveCampaignsPage inactiveCampaignsPageState ->
                                        Page.Campaigns.Inactive.view inactiveCampaignsPageState (toMsg << CampaignsPageMsg << Campaigns.InactiveCampaignsPageMsg)

                                    Campaigns.AllCampaignsPage allCampaignsPageState ->
                                        Page.Campaigns.All.view allCampaignsPageState (toMsg << CampaignsPageMsg << Campaigns.AllCampaignsPageMsg)

                                    Campaigns.CreateCampaignPage createCampaignPageState ->
                                        Page.Campaigns.Create.view createCampaignPageState (toMsg << CampaignsPageMsg << Campaigns.CreateCampaignPageMsg)

                                    Campaigns.ManageNumbersPage manageNumbersPageState ->
                                        Page.Campaigns.Numbers.view manageNumbersPageState (toMsg << CampaignsPageMsg << Campaigns.ManageNumbersPageMsg)

                                    Campaigns.RoutingPage routingPageState ->
                                        Page.Campaigns.Routing.view routingPageState (toMsg << CampaignsPageMsg << Campaigns.RoutingPageMsg)

                            ContentPage contentPage ->
                                case contentPage of
                                    Content.AudioArchivePage audioArchivePageState ->
                                        Page.Content.Audio.Archive.view audioArchivePageState (toMsg << ContentPageMsg << Content.AudioArchivePageMsg)

                                    Content.UploadAudioPage uploadAudioPageState ->
                                        Page.Content.Audio.Upload.view uploadAudioPageState (toMsg << ContentPageMsg << Content.UploadAudioPageMsg)

                                    Content.TextArchivePage textArchivePageState ->
                                        Page.Content.Text.Archive.view textArchivePageState (toMsg << ContentPageMsg << Content.TextArchivePageMsg)

                                    Content.CreateTextPage createTextPageState ->
                                        Page.Content.Text.Create.view createTextPageState (toMsg << ContentPageMsg << Content.CreateTextPageMsg)

                            ProjectsPage projectsPage ->
                                case projectsPage of
                                    Projects.CreateProjectPage createProjectPageState ->
                                        Page.Projects.Create.dashboardView createProjectPageState (toMsg << ProjectsPageMsg << Projects.CreateProjectPageMsg)

                                    Projects.SelectProjectPage selectProjectPageState ->
                                        Page.Projects.Select.dashboardView selectProjectPageState (toMsg << ProjectsPageMsg << Projects.SelectProjectPageMsg)

                                    Projects.ProjectSettingsPage projectSettingsPageState ->
                                        Page.Projects.Settings.view projectSettingsPageState (toMsg << ProjectsPageMsg << Projects.ProjectSettingsPageMsg)

                            ResultsPage resultsPage ->
                                case resultsPage of
                                    Results.AnalyticsPage analyticsPageState ->
                                        Page.Results.Analytics.view analyticsPageState (toMsg << ResultsPageMsg << Results.AnalyticsPageMsg)

                                    Results.AnswersPage answersPageState ->
                                        Page.Results.Answers.view answersPageState (toMsg << ResultsPageMsg << Results.AnswersPageMsg)

                                    Results.PollResultsPage pollResultsPageState ->
                                        Page.Results.Polls.view pollResultsPageState (toMsg << ResultsPageMsg << Results.PollResultsPageMsg)

                                    Results.CostPage costPageState ->
                                        Page.Results.Cost.view costPageState (toMsg << ResultsPageMsg << Results.CostPageMsg)

                            _ ->
                                text ""
                        ]


title : Page -> String
title page =
    case page of
        NotFoundPage ->
            "Page not found"

        MainPage mainPage ->
            case mainPage of
                Main.Dashboard dashboardState ->
                    ""

                Main.AppsPage appsPageState ->
                    ""

                Main.AudiencePage audiencePageState ->
                    ""

                Main.ListenerAudioPage listenerAudioPageState ->
                    ""

                Main.NotificationsPage notificationsPageState ->
                    ""

        UserPage userPage ->
            case userPage of
                User.LoginPage loginPageState ->
                    ""

                User.RegisterPage registerPageState ->
                    ""

                User.ProfilePage profilePageState ->
                    ""

                User.ResetPasswordPage resetPasswordPageState ->
                    ""

        CampaignsPage campaignsPage ->
            case campaignsPage of
                Campaigns.ActiveCampaignsPage activeCampaignsPageState ->
                    ""

                Campaigns.InactiveCampaignsPage inactiveCampaignsPageState ->
                    ""

                Campaigns.AllCampaignsPage allCampaignsPageState ->
                    ""

                Campaigns.CreateCampaignPage createCampaignPageState ->
                    ""

                Campaigns.ManageNumbersPage manageNumbersPageState ->
                    ""

                Campaigns.RoutingPage routingPageState ->
                    ""

        ContentPage contentPage ->
            case contentPage of
                Content.AudioArchivePage audioArchivePageState ->
                    ""

                Content.UploadAudioPage uploadAudioPageState ->
                    ""

                Content.TextArchivePage textArchivePageState ->
                    ""

                Content.CreateTextPage createTextPageState ->
                    ""

        ProjectsPage projectsPage ->
            case projectsPage of
                Projects.CreateProjectPage createProjectPageState ->
                    ""

                Projects.SelectProjectPage selectProjectPageState ->
                    ""

                Projects.ProjectSettingsPage projectSettingsPageState ->
                    ""

        ResultsPage resultsPage ->
            case resultsPage of
                Results.AnalyticsPage analyticsPageState ->
                    ""

                Results.AnswersPage answersPageState ->
                    ""

                Results.PollResultsPage pollResultsPageState ->
                    ""

                Results.CostPage costPageState ->
                    ""
