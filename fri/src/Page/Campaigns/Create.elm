module Page.Campaigns.Create exposing (Msg(..), State, init, subscriptions, update, view)

import Data.Campaign as Campaign exposing (Campaign)
import Form.Campaigns.Create
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as Json exposing (field)
import Ui
import Update.Deep exposing (..)
import Update.Deep.Api as Api exposing (Resource(..))
import Update.Deep.Form as Form


type Msg
    = FormMsg Form.Msg
    | ApiMsg (Api.Msg Campaign)


type alias State =
    { formModel : Form.Model Never Form.Campaigns.Create.Fields
    , api : Api.Model Campaign
    }


inForm : Wrap State Msg (Form.Model Never Form.Campaigns.Create.Fields) Form.Msg a
inForm =
    Form.component FormMsg


inApi : Wrap State Msg (Api.Model Campaign) (Api.Msg Campaign) a
inApi =
    Api.component ApiMsg


init : Update State msg a
init =
    let
        api =
            Api.init
                { endpoint = "/campaigns"
                , method = Api.HttpPost
                , decoder = field "campaign" Campaign.decoder
                }
    in
    save State
        |> andMap (Form.init [] Form.Campaigns.Create.validate)
        |> andMap api


handleSubmit : Form.Campaigns.Create.Fields -> State -> Update State Msg a
handleSubmit form =
    let
        json =
            form
                |> Form.Campaigns.Create.toJson
                |> Http.jsonBody
    in
    inApi (Api.sendRequest "" (Just json))


update : { redirect : String -> a } -> Msg -> State -> Update State Msg a
update { redirect } msg =
    let
        handleCampaignCreated { id } =
            applyCallback (redirect ("/campaigns/" ++ String.fromInt id))
    in
    case msg of
        FormMsg formMsg ->
            inForm (Form.update { onSubmit = handleSubmit } formMsg)

        ApiMsg apiMsg ->
            inApi (Api.update { onSuccess = handleCampaignCreated, onError = always save } apiMsg)


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions state toMsg =
    Sub.none


view : State -> (Msg -> msg) -> Html msg
view { formModel } toMsg =
    let
        { form, disabled } =
            formModel
    in
    Ui.card "Create new campaign"
        [ Form.Campaigns.Create.view form disabled (toMsg << FormMsg)
        ]
