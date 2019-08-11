module Page.Campaigns exposing (Msg(..), Page(..))

import Page.Campaigns.Collection
import Page.Campaigns.Create
import Page.Campaigns.Delete
import Page.Campaigns.Edit
import Page.Campaigns.Numbers
import Page.Campaigns.Routing
import Page.Campaigns.Show


type Msg
    = CampaignsCollectionPageMsg Page.Campaigns.Collection.Msg
    | ShowCampaignPageMsg Page.Campaigns.Show.Msg
    | CreateCampaignPageMsg Page.Campaigns.Create.Msg
    | EditCampaignPageMsg Page.Campaigns.Edit.Msg
    | DeleteCampaignPageMsg Page.Campaigns.Delete.Msg
    | ManageNumbersPageMsg Page.Campaigns.Numbers.Msg
    | RoutingPageMsg Page.Campaigns.Routing.Msg


type Page
    = CampaignsCollectionPage Page.Campaigns.Collection.State
    | ShowCampaignPage Page.Campaigns.Show.State
    | EditCampaignPage Page.Campaigns.Edit.State
    | DeleteCampaignPage Page.Campaigns.Delete.State
    | CreateCampaignPage Page.Campaigns.Create.State
    | ManageNumbersPage Page.Campaigns.Numbers.State
    | RoutingPage Page.Campaigns.Routing.State
