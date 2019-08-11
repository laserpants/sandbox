module Page.Campaigns.Collection exposing (Msg(..), State, breadcrumbs, init, subscriptions, update, view)

import Bootstrap.Card as Card
import Bootstrap.Card.Block as Block
import Bootstrap.Form.Input as Input
import Bootstrap.Tab as Tab
import Bootstrap.Utilities.Spacing as Spacing
import Data.Campaign as Campaign exposing (Campaign)
import Helpers.Api exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Json.Encode exposing (encode)
import Ports
import Table.Campaigns
import Ui
import Ui.Pagination
import Update.Deep exposing (..)
import Update.Deep.Api as Api exposing (Resource(..))
import Update.Deep.Pagination as Pagination exposing (fetchPage)
import Url exposing (Url)
import Websocket exposing (setSearchQuery, setSearchResults)
import Websocket.Search


type Msg
    = PaginationMsg (Pagination.Msg Campaign)
    | CampaignSearchQuery String
    | WebsocketMsg String
    | TabMsg Tab.State


type alias State =
    { page : Pagination.State Campaign
    , search : Websocket.Search Campaign
    , tab : Tab.State
    }


saveTab : Tab.State -> State -> Update State msg a
saveTab tab state =
    save { state | tab = tab }


inPagination : Wrap State Msg (Pagination.State Campaign) (Pagination.Msg Campaign) a
inPagination =
    Pagination.component PaginationMsg


init : Url -> Update State Msg a
init { fragment } =
    let
        page =
            Pagination.init
                { limit = 2
                , endpoint = "/campaigns"
                , field = "campaigns"
                , itemDecoder = Campaign.decoder
                }

        tabState =
            Tab.customInitialState (Maybe.withDefault "all" fragment)
    in
    save State
        |> andMap (page |> mapCmd PaginationMsg)
        |> andMap (save Websocket.Search.initial)
        |> andMap (save tabState)
        |> andThen (inPagination fetchPage)


update : Msg -> State -> Update State Msg a
update msg =
    case msg of
        PaginationMsg pageMsg ->
            inPagination (Pagination.update pageMsg)

        CampaignSearchQuery query ->
            setSearchQuery query
                >> andAddCmd (Ports.websocketOut (encode 0 (Websocket.Search.encodeSearchQuery "campaigns" query)))

        WebsocketMsg websocketMsg ->
            case Json.decodeString Websocket.messageDecoder websocketMsg of
                Ok (Websocket.SearchCampaignsResults { query, results }) ->
                    with .search
                        (\search ->
                            if query == search.query then
                                setSearchResults results

                            else
                                save
                        )

                _ ->
                    save

        TabMsg tabState ->
            saveTab tabState


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions { tab } toMsg =
    Sub.batch
        [ Ports.websocketIn (toMsg << WebsocketMsg)
        , Tab.subscriptions tab (toMsg << TabMsg)
        ]


view : State -> (Msg -> msg) -> Html msg
view { page, search, tab } toMsg =
    Ui.card "Campaigns"
        [ h6 [] [ b [] [ text "Search campaigns" ] ]
        , Input.text
            [ Input.attrs [ Spacing.mb4 ]
            , Input.placeholder "Type the name of a campaign"
            , Input.onInput CampaignSearchQuery
            ]
        , Tab.config TabMsg
            |> Tab.useHash True
            |> Tab.items
                [ Tab.item
                    { id = "all"
                    , link = Tab.link [] [ text "All" ]
                    , pane =
                        Tab.pane [ class "mt-3" ]
                            [ Ui.Pagination.table page search Table.Campaigns.view PaginationMsg ]
                    }
                , Tab.item
                    { id = "active"
                    , link = Tab.link [] [ text "Active" ]
                    , pane =
                        Tab.pane [ class "mt-3" ]
                            [ Ui.Pagination.table page search Table.Campaigns.view PaginationMsg ]
                    }
                , Tab.item
                    { id = "inactive"
                    , link = Tab.link [] [ text "Inactive" ]
                    , pane =
                        Tab.pane [ class "mt-3" ]
                            [ Ui.Pagination.table page search Table.Campaigns.view PaginationMsg ]
                    }
                ]
            |> Tab.view tab
        ]
        |> Html.map toMsg


breadcrumbs : State -> List ( String, Maybe String )
breadcrumbs state =
    [ ( "Campaigns", Nothing )
    ]
