module Ui.Sidebar exposing (Msg(..), State, component, init, subscriptions, toggle, update, view)

import Browser.Events
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Update.Deep exposing (..)


type Menu
    = Campaigns
    | Content
    | Results


type MenuStatus
    = Open Menu
    | Listen Menu
    | Closed


type Msg
    = ToggleMenu Menu
    | MenuStatus MenuStatus
    | ToggleSidebar


type alias State =
    { toggled : Bool
    , menuStatus : MenuStatus
    }


component : (Msg -> msg) -> Wrap { b | sidebar : State } msg State Msg a
component msg =
    wrapState
        { get = .sidebar
        , set = \state sidebar -> { state | sidebar = sidebar }
        , msg = msg
        }


setMenuStatus : MenuStatus -> State -> Update State msg a
setMenuStatus menuStatus state =
    save { state | menuStatus = menuStatus }


isCurrentlyExpanded :
    State
    ->
        { campaigns : { isExpanded : Bool }
        , content : { isExpanded : Bool }
        , results : { isExpanded : Bool }
        }
isCurrentlyExpanded { menuStatus } =
    let
        allClosed =
            { campaigns = { isExpanded = False }
            , content = { isExpanded = False }
            , results = { isExpanded = False }
            }

        isOpen menu =
            case menu of
                Campaigns ->
                    { allClosed | campaigns = { isExpanded = True } }

                Content ->
                    { allClosed | content = { isExpanded = True } }

                Results ->
                    { allClosed | results = { isExpanded = True } }
    in
    case menuStatus of
        Open menu ->
            isOpen menu

        Listen menu ->
            isOpen menu

        Closed ->
            allClosed


toggleMenu : Menu -> MenuStatus -> MenuStatus
toggleMenu menu status =
    case status of
        Open openMenu ->
            if openMenu == menu then
                Closed

            else
                Listen menu

        Listen listenMenu ->
            if listenMenu == menu then
                Closed

            else
                Open menu

        Closed ->
            Open menu


toggle : State -> Update State msg a
toggle state =
    save { state | toggled = not state.toggled }


init : Update State msg a
init =
    save State
        |> andMap (save False)
        |> andMap (save Closed)


update : Msg -> State -> Update State Msg a
update msg =
    case msg of
        ToggleMenu menu ->
            with .menuStatus (setMenuStatus << toggleMenu menu)

        MenuStatus menuStatus ->
            setMenuStatus menuStatus

        ToggleSidebar ->
            toggle


menuSubscriptions : MenuStatus -> (MenuStatus -> msg) -> Sub msg
menuSubscriptions menuStatus toMsg =
    case menuStatus of
        Open menu ->
            Browser.Events.onAnimationFrame (always (toMsg (Listen menu)))

        Listen _ ->
            Browser.Events.onClick (Json.succeed (toMsg Closed))

        Closed ->
            Sub.none


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions { menuStatus } toMsg =
    menuSubscriptions menuStatus (toMsg << MenuStatus)


view : State -> (Msg -> msg) -> Html msg
view state toMsg =
    let
        ulClass =
            (if state.toggled then
                "toggled "

             else
                ""
            )
                ++ "navbar-nav bg-secondary sidebar sidebar-dark accordion"

        currently =
            isCurrentlyExpanded state

        divider =
            hr [ class "sidebar-divider" ] []

        heading title =
            div [ class "sidebar-heading" ] [ text title ]

        navItem =
            li [ class "nav-item" ]

        navLink item =
            navItem
                [ a
                    [ href item.href, class "nav-link" ]
                    [ i [ class ("fas fa-fw " ++ item.iconClass) ] []
                    , span []
                        [ text item.text
                        ]
                    ]
                ]

        subMenu item =
            navItem
                [ span
                    [ class "noselect"
                    , class
                        ("nav-link"
                            ++ (if not item.isExpanded then
                                    " collapsed"

                                else
                                    ""
                               )
                        )
                    , style "cursor" "pointer"
                    , onClick (ToggleMenu item.menu)
                    , attribute "data-toggle" "collapse"
                    ]
                    [ i [ class ("fas fa-fw " ++ item.iconClass) ] []
                    , span [] [ text item.text ]
                    ]
                , div
                    [ class
                        ("collapse "
                            ++ (if item.isExpanded then
                                    "show"

                                else
                                    ""
                               )
                        )
                    ]
                    [ div [ class "border-left-success animated--fade-in bg-white py-2 collapse-inner rounded shadow-sm" ] item.children
                    ]
                ]

        subMenuHeading title =
            h6 [ class "text-success collapse-header" ] [ text title ]

        subMenuDivider =
            div [ class "dropdown-divider" ] []

        subMenuLink item =
            a [ href item.href, class "collapse-item" ] [ text item.text ]
    in
    ul [ class ulClass ]
        [ navLink { href = "/", iconClass = "fa-chart-bar", text = "Dashboard" }
        , divider
        , heading "Interactivity"
        , subMenu
            { iconClass = "fa-comments"
            , text = "Campaigns"
            , menu = Campaigns
            , isExpanded = currently.campaigns.isExpanded
            , children =
                [ subMenuHeading "Campaigns"
                , subMenuLink { href = "/campaigns", text = "Manage campaigns" }
                , subMenuLink { href = "/campaigns/new", text = "Create new" }
                , subMenuDivider
                , subMenuHeading "Phone numbers"
                , subMenuLink { href = "/numbers/manage", text = "Number configuration" }
                , subMenuLink { href = "/numbers/routing", text = "Routing" }
                ]
            }
        , navLink { href = "/audience", iconClass = "fa-users", text = "Audience" }
        , subMenu
            { iconClass = "fa-database"
            , text = "Content"
            , menu = Content
            , isExpanded = currently.content.isExpanded
            , children =
                [ subMenuHeading "Audio"
                , subMenuLink { href = "/content/audio/archive", text = "Archive" }
                , subMenuLink { href = "/content/audio/upload", text = "Upload" }
                , subMenuDivider
                , subMenuHeading "Text"
                , subMenuLink { href = "/content/text/archive", text = "Message content" }
                , subMenuLink { href = "/content/text/create", text = "Create text message" }
                ]
            }
        , divider
        , heading "Insights"
        , subMenu
            { iconClass = "fa-chart-pie"
            , text = "Results"
            , menu = Results
            , isExpanded = currently.results.isExpanded
            , children =
                [ subMenuHeading "Campaigns"
                , subMenuLink { href = "/results/polls", text = "Polls" }
                , subMenuLink { href = "/results/answers", text = "Answers" }
                , subMenuDivider
                , subMenuHeading "Data analytics"
                , subMenuLink { href = "/results/analytics", text = "Data analytics tools" }
                ]
            }
        , navLink { href = "/audio", iconClass = "fa-file-audio", text = "Listener Audio" }
        , divider
        , heading "Extensions"
        , navLink { href = "/apps", iconClass = "fa-mobile-alt", text = "Apps" }
        , divider
        , div [ class "text-center d-none d-md-inline" ]
            [ button [ onClick ToggleSidebar, id "sidebarToggle", class "rounded-circle border-0" ] []
            ]
        ]
        |> Html.map toMsg
