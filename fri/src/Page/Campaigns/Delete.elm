module Page.Campaigns.Delete exposing (Msg(..), State, breadcrumbs, init, subscriptions, update, view)

import Bootstrap.Alert as Alert
import Bootstrap.Card as Card
import Bootstrap.Card.Block as Block
import Data.Campaign as Campaign exposing (Campaign)
import Form.Campaigns.ConfirmDelete
import Helpers.Api exposing (resourceErrorMessage)
import Helpers.Form exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json exposing (field)
import Ui
import Ui.Spinner exposing (..)
import Update.Deep exposing (..)
import Update.Deep.Api as Api exposing (Resource(..))
import Update.Deep.Form as Form


type Msg
    = FormMsg Form.Msg
    | ApiMsg (Api.Msg Campaign)


type alias State =
    { formModel : Form.Model CustomError Form.Campaigns.ConfirmDelete.Fields
    , api : Api.Model Campaign
    }


inForm : Wrap State Msg (Form.Model CustomError Form.Campaigns.ConfirmDelete.Fields) Form.Msg a
inForm =
    Form.component FormMsg


inApi : Wrap State Msg (Api.Model Campaign) (Api.Msg Campaign) a
inApi =
    Api.component ApiMsg


init : Int -> Update State Msg a
init id =
    let
        api =
            Api.init
                { endpoint = "/campaigns/" ++ String.fromInt id
                , method = Api.HttpGet
                , decoder = field "campaign" Campaign.decoder
                }
    in
    save State
        |> andMap (Form.init [] Form.Campaigns.ConfirmDelete.validate)
        |> andMap api
        |> andThen (inApi Api.sendSimpleRequest)


update : Msg -> State -> Update State Msg a
update msg =
    case msg of
        FormMsg formMsg ->
            inForm (Form.update { onSubmit = always save } formMsg)

        ApiMsg apiMsg ->
            inApi (Api.update { onSuccess = always save, onError = always save } apiMsg)


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions state toMsg =
    Sub.none


view : State -> (Msg -> msg) -> Html msg
view { formModel, api } toMsg =
    Card.config []
        |> Card.block []
            [ Block.text []
                [ case api.resource of
                    Available { name } ->
                        let
                            { form, disabled } =
                                formModel
                        in
                        div []
                            [ h2 [ class "text-gray-900", class "mb-4" ] [ text "Delete campaign" ]
                            , Alert.simpleDanger []
                                [ text "You are about to permanently delete the campaign "
                                , b [] [ text name ]
                                , text ". "
                                , text "To confirm this action, enter the name of the campaign in the field below."
                                ]
                            , Form.Campaigns.ConfirmDelete.view form disabled (toMsg << FormMsg)
                            ]

                    Error _ ->
                        resourceErrorMessage api.resource

                    Requested ->
                        spinner

                    NotRequested ->
                        text ""
                ]
            ]
        |> Card.view


breadcrumbs : State -> List ( String, Maybe String )
breadcrumbs { api } =
    case api.resource of
        Available { id, name } ->
            [ ( "Campaigns", Just "/campaigns" )
            , ( name, Just ("/campaigns/" ++ String.fromInt id) )
            , ( "Delete", Nothing )
            ]

        _ ->
            [ ( "Campaigns", Just "/campaigns" )
            , ( "...", Nothing )
            ]
