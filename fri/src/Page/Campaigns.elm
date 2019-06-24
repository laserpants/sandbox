module Page.Campaigns exposing (Msg(..), Page(..))

import Page.Campaigns.Active as ActiveCampaigns
import Page.Campaigns.All as AllCampaigns
import Page.Campaigns.Create as CreateCampaign
import Page.Campaigns.Inactive as InactiveCampaigns
import Page.Campaigns.Numbers as ManageCampaignNumbers
import Page.Campaigns.Routing as Routing


type Msg
    = ActiveCampaignsPageMsg ActiveCampaigns.Msg
    | InactiveCampaignsPageMsg InactiveCampaigns.Msg
    | AllCampaignsPageMsg AllCampaigns.Msg
    | CreateCampaignPageMsg CreateCampaign.Msg
    | ManageNumbersPageMsg ManageCampaignNumbers.Msg
    | RoutingPageMsg Routing.Msg


type Page
    = ActiveCampaignsPage ActiveCampaigns.State
    | InactiveCampaignsPage InactiveCampaigns.State
    | AllCampaignsPage AllCampaigns.State
    | CreateCampaignPage CreateCampaign.State
    | ManageNumbersPage ManageCampaignNumbers.State
    | RoutingPage Routing.State
