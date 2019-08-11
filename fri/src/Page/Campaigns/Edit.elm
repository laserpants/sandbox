module Page.Campaigns.Edit exposing (Msg(..), State, breadcrumbs, init, subscriptions, update, view)

import Bootstrap.Card as Card
import Bootstrap.Card.Block as Block
import Data.Campaign as Campaign exposing (Campaign)
import Helpers.Api exposing (resourceErrorMessage)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json exposing (field)
import Ui
import Ui.Spinner exposing (..)
import Update.Deep exposing (..)
import Update.Deep.Api as Api exposing (Resource(..))


type Msg
    = ApiMsg (Api.Msg Campaign)


type alias State =
    { api : Api.Model Campaign
    }


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
        |> andMap api
        |> andThen (inApi Api.sendSimpleRequest)


update : Msg -> State -> Update State Msg a
update msg =
    case msg of
        ApiMsg apiMsg ->
            inApi (Api.update { onSuccess = always save, onError = always save } apiMsg)


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions state toMsg =
    Sub.none


view : State -> (Msg -> msg) -> Html msg
view { api } toMsg =
    Card.config []
        |> Card.block []
            [ Block.text []
                [ case api.resource of
                    Available campaign ->
                        div []
                            [ h2 [ class "text-gray-900", class "mb-4" ] [ text "Edit campaign" ]
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
            , ( "Edit", Nothing )
            ]

        _ ->
            [ ( "Campaigns", Just "/campaigns" )
            , ( "...", Nothing )
            ]
