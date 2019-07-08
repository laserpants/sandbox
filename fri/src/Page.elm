module Page exposing (Msg(..), Page(..), component, current, fromRoute, subscriptions, title, update, view)

import Bootstrap.Grid as Grid
import Bootstrap.Grid.Col as Col
import Bootstrap.Grid.Row as Row
import Bootstrap.Utilities.Spacing as Spacing
import Data.Project exposing (Project)
import Data.Session exposing (Session)
import Data.User exposing (User)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Page.Campaigns as Campaigns
import Page.Campaigns.Collection
import Page.Campaigns.Create
import Page.Campaigns.Numbers
import Page.Campaigns.Routing
import Page.Campaigns.Show
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
import Url exposing (Url)


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


component : (Msg -> msg) -> Wrap { b | page : Page } msg Page Msg a
component msg =
    wrapState
        { get = .page
        , set = \state page -> { state | page = page }
        , msg = msg
        }


current :
    Page
    ->
        { isAppsPage : Bool
        , isAudiencePage : Bool
        , isCampaignsCollectionPage : Bool
        , isShowCampaignPage : Bool
        , isCreateCampaignPage : Bool
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
            , isCampaignsCollectionPage = False
            , isShowCampaignPage = False
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
                Campaigns.CampaignsCollectionPage _ ->
                    { none | isCampaignsCollectionPage = True }

                Campaigns.ShowCampaignPage _ ->
                    { none | isShowCampaignPage = True }

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


updatePage : (b -> m) -> (c -> d) -> Update b c (m -> Update m c e) -> Update m d e
updatePage constr msg =
    mapCmd msg << fold << andThen (save << constr)


type alias UpdatePage a b e =
    Update a b (Page -> Update Page b e) -> Update Page Msg e


mainDashboard : UpdatePage Page.Main.Dashboard.State Page.Main.Dashboard.Msg e
mainDashboard =
    updatePage (MainPage << Main.Dashboard) (MainPageMsg << Main.DashboardMsg)


appsPage : UpdatePage Page.Main.Apps.State Page.Main.Apps.Msg e
appsPage =
    updatePage (MainPage << Main.AppsPage) (MainPageMsg << Main.AppsPageMsg)


audiencePage : UpdatePage Page.Main.Audience.State Page.Main.Audience.Msg e
audiencePage =
    updatePage (MainPage << Main.AudiencePage) (MainPageMsg << Main.AudiencePageMsg)


listenerAudioPage : UpdatePage Page.Main.ListenerAudio.State Page.Main.ListenerAudio.Msg e
listenerAudioPage =
    updatePage (MainPage << Main.ListenerAudioPage) (MainPageMsg << Main.ListenerAudioPageMsg)


notificationsPage : UpdatePage Page.Main.Notifications.State Page.Main.Notifications.Msg e
notificationsPage =
    updatePage (MainPage << Main.NotificationsPage) (MainPageMsg << Main.NotificationsPageMsg)


campaignsCollectionPage : UpdatePage Page.Campaigns.Collection.State Page.Campaigns.Collection.Msg e
campaignsCollectionPage =
    updatePage (CampaignsPage << Campaigns.CampaignsCollectionPage) (CampaignsPageMsg << Campaigns.CampaignsCollectionPageMsg)


showCampaignPage : UpdatePage Page.Campaigns.Show.State Page.Campaigns.Show.Msg e
showCampaignPage =
    updatePage (CampaignsPage << Campaigns.ShowCampaignPage) (CampaignsPageMsg << Campaigns.ShowCampaignPageMsg)


createCampaignPage : UpdatePage Page.Campaigns.Create.State Page.Campaigns.Create.Msg e
createCampaignPage =
    updatePage (CampaignsPage << Campaigns.CreateCampaignPage) (CampaignsPageMsg << Campaigns.CreateCampaignPageMsg)


manageNumbersPage : UpdatePage Page.Campaigns.Numbers.State Page.Campaigns.Numbers.Msg e
manageNumbersPage =
    updatePage (CampaignsPage << Campaigns.ManageNumbersPage) (CampaignsPageMsg << Campaigns.ManageNumbersPageMsg)


routingPage : UpdatePage Page.Campaigns.Routing.State Page.Campaigns.Routing.Msg e
routingPage =
    updatePage (CampaignsPage << Campaigns.RoutingPage) (CampaignsPageMsg << Campaigns.RoutingPageMsg)


audioArchivePage : UpdatePage Page.Content.Audio.Archive.State Page.Content.Audio.Archive.Msg e
audioArchivePage =
    updatePage (ContentPage << Content.AudioArchivePage) (ContentPageMsg << Content.AudioArchivePageMsg)


uploadAudioPage : UpdatePage Page.Content.Audio.Upload.State Page.Content.Audio.Upload.Msg e
uploadAudioPage =
    updatePage (ContentPage << Content.UploadAudioPage) (ContentPageMsg << Content.UploadAudioPageMsg)


createMessagePage : UpdatePage Page.Content.Text.Create.State Page.Content.Text.Create.Msg e
createMessagePage =
    updatePage (ContentPage << Content.CreateTextPage) (ContentPageMsg << Content.CreateTextPageMsg)


messageArchivePage : UpdatePage Page.Content.Text.Archive.State Page.Content.Text.Archive.Msg e
messageArchivePage =
    updatePage (ContentPage << Content.TextArchivePage) (ContentPageMsg << Content.TextArchivePageMsg)


createProjectPage : UpdatePage Page.Projects.Create.State Page.Projects.Create.Msg e
createProjectPage =
    updatePage (ProjectsPage << Projects.CreateProjectPage) (ProjectsPageMsg << Projects.CreateProjectPageMsg)


selectProjectPage : UpdatePage Page.Projects.Select.State Page.Projects.Select.Msg e
selectProjectPage =
    updatePage (ProjectsPage << Projects.SelectProjectPage) (ProjectsPageMsg << Projects.SelectProjectPageMsg)


projectSettingsPage : UpdatePage Page.Projects.Settings.State Page.Projects.Settings.Msg e
projectSettingsPage =
    updatePage (ProjectsPage << Projects.ProjectSettingsPage) (ProjectsPageMsg << Projects.ProjectSettingsPageMsg)


analyticsPage : UpdatePage Page.Results.Analytics.State Page.Results.Analytics.Msg e
analyticsPage =
    updatePage (ResultsPage << Results.AnalyticsPage) (ResultsPageMsg << Results.AnalyticsPageMsg)


answersPage : UpdatePage Page.Results.Answers.State Page.Results.Answers.Msg e
answersPage =
    updatePage (ResultsPage << Results.AnswersPage) (ResultsPageMsg << Results.AnswersPageMsg)


costPage : UpdatePage Page.Results.Cost.State Page.Results.Cost.Msg e
costPage =
    updatePage (ResultsPage << Results.CostPage) (ResultsPageMsg << Results.CostPageMsg)


pollResultsPage : UpdatePage Page.Results.Polls.State Page.Results.Polls.Msg e
pollResultsPage =
    updatePage (ResultsPage << Results.PollResultsPage) (ResultsPageMsg << Results.PollResultsPageMsg)


loginPage : UpdatePage Page.User.Login.State Page.User.Login.Msg e
loginPage =
    updatePage (UserPage << User.LoginPage) (UserPageMsg << User.LoginPageMsg)


registerPage : UpdatePage Page.User.Register.State Page.User.Register.Msg e
registerPage =
    updatePage (UserPage << User.RegisterPage) (UserPageMsg << User.RegisterPageMsg)


profilePage : UpdatePage Page.User.Profile.State Page.User.Profile.Msg e
profilePage =
    updatePage (UserPage << User.ProfilePage) (UserPageMsg << User.ProfilePageMsg)


resetPasswordPage : UpdatePage Page.User.ResetPassword.State Page.User.ResetPassword.Msg e
resetPasswordPage =
    updatePage (UserPage << User.ResetPasswordPage) (UserPageMsg << User.ResetPasswordPageMsg)


update : { onAuthResponse : Maybe Session -> a, onProjectSelected : Project -> a } -> Msg -> Page -> Update Page Msg a
update { onAuthResponse, onProjectSelected } msg page =
    case ( page, msg ) of
        ( NotFoundPage, _ ) ->
            save page

        ( MainPage mainPage, MainPageMsg mainPageMsg ) ->
            case ( mainPage, mainPageMsg ) of
                ( Main.Dashboard dashboardState, Main.DashboardMsg dashboardMsg ) ->
                    mainDashboard (Page.Main.Dashboard.update dashboardMsg dashboardState)

                ( Main.AppsPage appsPageState, Main.AppsPageMsg appsPageMsg ) ->
                    appsPage (Page.Main.Apps.update appsPageMsg appsPageState)

                ( Main.AudiencePage audiencePageState, Main.AudiencePageMsg audiencePageMsg ) ->
                    audiencePage (Page.Main.Audience.update audiencePageMsg audiencePageState)

                ( Main.ListenerAudioPage listenerAudioPageState, Main.ListenerAudioPageMsg listenerAudioPageMsg ) ->
                    listenerAudioPage (Page.Main.ListenerAudio.update listenerAudioPageMsg listenerAudioPageState)

                ( Main.NotificationsPage notificationsPageState, Main.NotificationsPageMsg notificationsPageMsg ) ->
                    notificationsPage (Page.Main.Notifications.update notificationsPageMsg notificationsPageState)

                _ ->
                    save page

        ( UserPage userPage, UserPageMsg userPageMsg ) ->
            case ( userPage, userPageMsg ) of
                ( User.LoginPage loginPageState, User.LoginPageMsg loginPageMsg ) ->
                    loginPage (Page.User.Login.update { onAuthResponse = applyCallback << onAuthResponse } loginPageMsg loginPageState)

                ( User.RegisterPage registerPageState, User.RegisterPageMsg registerPageMsg ) ->
                    registerPage (Page.User.Register.update registerPageMsg registerPageState)

                ( User.ProfilePage profilePageState, User.ProfilePageMsg profilePageMsg ) ->
                    profilePage (Page.User.Profile.update profilePageMsg profilePageState)

                ( User.ResetPasswordPage resetPasswordPageState, User.ResetPasswordPageMsg resetPasswordPageMsg ) ->
                    resetPasswordPage (Page.User.ResetPassword.update resetPasswordPageMsg resetPasswordPageState)

                _ ->
                    save page

        ( CampaignsPage campaignsPage, CampaignsPageMsg campaignsPageMsg ) ->
            case ( campaignsPage, campaignsPageMsg ) of
                ( Campaigns.CampaignsCollectionPage campaignsCollectionPageState, Campaigns.CampaignsCollectionPageMsg campaignsCollectionPageMsg ) ->
                    campaignsCollectionPage (Page.Campaigns.Collection.update campaignsCollectionPageMsg campaignsCollectionPageState)

                ( Campaigns.ShowCampaignPage showCampaignPageState, Campaigns.ShowCampaignPageMsg showCampaignPageMsg ) ->
                    showCampaignPage (Page.Campaigns.Show.update showCampaignPageMsg showCampaignPageState)

                ( Campaigns.CreateCampaignPage createCampaignPageState, Campaigns.CreateCampaignPageMsg createCampaignPageMsg ) ->
                    createCampaignPage (Page.Campaigns.Create.update createCampaignPageMsg createCampaignPageState)

                ( Campaigns.ManageNumbersPage manageNumbersPageState, Campaigns.ManageNumbersPageMsg manageNumbersPageMsg ) ->
                    manageNumbersPage (Page.Campaigns.Numbers.update manageNumbersPageMsg manageNumbersPageState)

                ( Campaigns.RoutingPage routingPageState, Campaigns.RoutingPageMsg routingPageMsg ) ->
                    routingPage (Page.Campaigns.Routing.update routingPageMsg routingPageState)

                _ ->
                    save page

        ( ContentPage contentPage, ContentPageMsg contentPageMsg ) ->
            case ( contentPage, contentPageMsg ) of
                ( Content.AudioArchivePage audioArchivePageState, Content.AudioArchivePageMsg audioArchivePageMsg ) ->
                    audioArchivePage (Page.Content.Audio.Archive.update audioArchivePageMsg audioArchivePageState)

                ( Content.UploadAudioPage uploadAudioPageState, Content.UploadAudioPageMsg uploadAudioPageMsg ) ->
                    uploadAudioPage (Page.Content.Audio.Upload.update uploadAudioPageMsg uploadAudioPageState)

                ( Content.TextArchivePage messageArchivePageState, Content.TextArchivePageMsg messageArchivePageMsg ) ->
                    messageArchivePage (Page.Content.Text.Archive.update messageArchivePageMsg messageArchivePageState)

                ( Content.CreateTextPage createMessagePageState, Content.CreateTextPageMsg createMessagePageMsg ) ->
                    createMessagePage (Page.Content.Text.Create.update createMessagePageMsg createMessagePageState)

                _ ->
                    save page

        ( ProjectsPage projectsPage, ProjectsPageMsg projectsPageMsg ) ->
            case ( projectsPage, projectsPageMsg ) of
                ( Projects.CreateProjectPage createProjectPageState, Projects.CreateProjectPageMsg createProjectPageMsg ) ->
                    createProjectPage (Page.Projects.Create.update createProjectPageMsg createProjectPageState)

                ( Projects.SelectProjectPage selectProjectPageState, Projects.SelectProjectPageMsg selectProjectPageMsg ) ->
                    selectProjectPage (Page.Projects.Select.update { onProjectSelected = applyCallback << onProjectSelected } selectProjectPageMsg selectProjectPageState)

                ( Projects.ProjectSettingsPage projectSettingsPageState, Projects.ProjectSettingsPageMsg projectSettingsPageMsg ) ->
                    projectSettingsPage (Page.Projects.Settings.update projectSettingsPageMsg projectSettingsPageState)

                _ ->
                    save page

        ( ResultsPage resultsPage, ResultsPageMsg resultsPageMsg ) ->
            case ( resultsPage, resultsPageMsg ) of
                ( Results.AnalyticsPage analyticsPageState, Results.AnalyticsPageMsg analyticsPageMsg ) ->
                    analyticsPage (Page.Results.Analytics.update analyticsPageMsg analyticsPageState)

                ( Results.AnswersPage answersPageState, Results.AnswersPageMsg answersPageMsg ) ->
                    answersPage (Page.Results.Answers.update answersPageMsg answersPageState)

                ( Results.PollResultsPage pollResultsPageState, Results.PollResultsPageMsg pollResultsPageMsg ) ->
                    pollResultsPage (Page.Results.Polls.update pollResultsPageMsg pollResultsPageState)

                ( Results.CostPage costPageState, Results.CostPageMsg costPageMsg ) ->
                    costPage (Page.Results.Cost.update costPageMsg costPageState)

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
                Campaigns.CampaignsCollectionPage campaignsCollectionPageState ->
                    Page.Campaigns.Collection.subscriptions campaignsCollectionPageState (toMsg << CampaignsPageMsg << Campaigns.CampaignsCollectionPageMsg)

                Campaigns.ShowCampaignPage showCampaignPageState ->
                    Page.Campaigns.Show.subscriptions showCampaignPageState (toMsg << CampaignsPageMsg << Campaigns.ShowCampaignPageMsg)

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

                Content.TextArchivePage messageArchivePageState ->
                    Page.Content.Text.Archive.subscriptions messageArchivePageState (toMsg << ContentPageMsg << Content.TextArchivePageMsg)

                Content.CreateTextPage createMessagePageState ->
                    Page.Content.Text.Create.subscriptions createMessagePageState (toMsg << ContentPageMsg << Content.CreateTextPageMsg)

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


fromRoute : Route -> Url -> Update Page Msg a
fromRoute route url =
    case route of
        Logout ->
            save NotFoundPage

        ResetPassword ->
            resetPasswordPage Page.User.ResetPassword.init

        Login ->
            loginPage Page.User.Login.init

        Register ->
            registerPage Page.User.Register.init

        Profile ->
            profilePage Page.User.Profile.init

        Settings ->
            projectSettingsPage Page.Projects.Settings.init

        Projects ->
            selectProjectPage Page.Projects.Select.init

        NewProject ->
            createProjectPage Page.Projects.Create.init

        Home ->
            mainDashboard Page.Main.Dashboard.init

        Notifications ->
            notificationsPage Page.Main.Notifications.init

        CampaignsCollection ->
            campaignsCollectionPage (Page.Campaigns.Collection.init url)

        ShowCampaign id ->
            showCampaignPage Page.Campaigns.Show.init

        NewCampaign ->
            createCampaignPage Page.Campaigns.Create.init

        ManageNumbers ->
            manageNumbersPage Page.Campaigns.Numbers.init

        Routing ->
            routingPage Page.Campaigns.Routing.init

        Audience ->
            audiencePage Page.Main.Audience.init

        AudioArchive ->
            audioArchivePage Page.Content.Audio.Archive.init

        UploadAudio ->
            uploadAudioPage Page.Content.Audio.Upload.init

        MessageArchive ->
            messageArchivePage Page.Content.Text.Archive.init

        CreateMessage ->
            createMessagePage Page.Content.Text.Create.init

        PollResults ->
            pollResultsPage Page.Results.Polls.init

        Answers ->
            answersPage Page.Results.Answers.init

        Cost ->
            costPage Page.Results.Cost.init

        Analytics ->
            analyticsPage Page.Results.Analytics.init

        ListenerAudio ->
            listenerAudioPage Page.Main.ListenerAudio.init

        Apps ->
            appsPage Page.Main.Apps.init


type alias UiLayout msg =
    Ui.LayoutConfig msg -> List (Html msg) -> Html msg


type alias DashboardLayout msg =
    User -> Project -> String -> List (Html msg) -> Html msg


view : Page -> Maybe Session -> UiLayout msg -> DashboardLayout msg -> (Msg -> msg) -> Html msg
view page maybeSession uiLayout dashboardLayout toMsg =
    case ( page, maybeSession ) of
        ( NotFoundPage, _ ) ->
            uiLayout
                { colAttrs = [ Col.md10 ], bgClass = "bg-primary" }
                [ Grid.row []
                    [ Grid.col
                        [ Col.lg12
                        ]
                        [ div [ Spacing.p5 ]
                            [ h2
                                [ Spacing.mb4
                                , class "text-gray-900 text-center"
                                ]
                                [ text "Page not found" ]
                            ]
                        ]
                    ]
                ]

        ( UserPage (User.LoginPage loginPageState), Nothing ) ->
            uiLayout
                { colAttrs = [ Col.md10 ], bgClass = "bg-primary" }
                [ Page.User.Login.view loginPageState (toMsg << UserPageMsg << User.LoginPageMsg)
                ]

        ( UserPage (User.RegisterPage registerPageState), Nothing ) ->
            uiLayout
                { colAttrs = [ Col.lg8, Col.xl6 ], bgClass = "bg-success" }
                [ Page.User.Register.view registerPageState (toMsg << UserPageMsg << User.RegisterPageMsg)
                ]

        ( UserPage (User.ResetPasswordPage resetPasswordPageState), Nothing ) ->
            uiLayout
                { colAttrs = [ Col.lg6, Col.xl5 ], bgClass = "bg-primary" }
                [ Page.User.ResetPassword.view resetPasswordPageState (toMsg << UserPageMsg << User.ResetPasswordPageMsg)
                ]

        ( _, Nothing ) ->
            text ""

        ( _, Just ({ user, locale } as session) ) ->
            case session.project of
                Nothing ->
                    uiLayout
                        { colAttrs = [ Col.md10 ]
                        , bgClass = "bg-success"
                        }
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
                    dashboardLayout user
                        project
                        locale
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
                                    Campaigns.CampaignsCollectionPage campaignsCollectionPageState ->
                                        Page.Campaigns.Collection.view campaignsCollectionPageState (toMsg << CampaignsPageMsg << Campaigns.CampaignsCollectionPageMsg)

                                    Campaigns.CreateCampaignPage createCampaignPageState ->
                                        Page.Campaigns.Create.view createCampaignPageState (toMsg << CampaignsPageMsg << Campaigns.CreateCampaignPageMsg)

                                    Campaigns.ShowCampaignPage showCampaignPageState ->
                                        Page.Campaigns.Show.view showCampaignPageState (toMsg << CampaignsPageMsg << Campaigns.ShowCampaignPageMsg)

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

                                    Content.TextArchivePage messageArchivePageState ->
                                        Page.Content.Text.Archive.view messageArchivePageState (toMsg << ContentPageMsg << Content.TextArchivePageMsg)

                                    Content.CreateTextPage createMessagePageState ->
                                        Page.Content.Text.Create.view createMessagePageState (toMsg << ContentPageMsg << Content.CreateTextPageMsg)

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
                Campaigns.CampaignsCollectionPage campaignsCollectionPageState ->
                    ""

                Campaigns.CreateCampaignPage createCampaignPageState ->
                    ""

                Campaigns.ShowCampaignPage showCampaignPageState ->
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

                Content.TextArchivePage messageArchivePageState ->
                    ""

                Content.CreateTextPage createMessagePageState ->
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
