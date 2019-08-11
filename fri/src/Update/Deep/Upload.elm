module Update.Deep.Upload exposing (Msg(..), State, Status(..), component, init, onChange, setStatus, subscriptions, update)

import Browser
import File exposing (File)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as Json
import Update.Deep exposing (..)


type Msg
    = GotFiles (List File)
    | GotProgress Http.Progress
    | Uploaded (Result Http.Error ())


type Status
    = Idle
    | Uploading Float
    | Done
    | Fail


type alias Config =
    { url : String
    , headers : List Http.Header
    }


type alias State =
    { status : Status
    , config : Config
    , files : List File
    }


setStatus : Status -> State -> Update State msg a
setStatus status state =
    save { state | status = status }


setFiles : List File -> State -> Update State msg a
setFiles files state =
    save { state | files = files }


component : (Msg -> msg) -> Wrap { b | upload : State } msg State Msg a
component msg =
    wrapState
        { get = .upload
        , set = \state upload -> { state | upload = upload }
        , msg = msg
        }


init : Config -> Update State msg a
init config =
    save State
        |> andMap (save Idle)
        |> andMap (save config)
        |> andMap (save [])


update : Msg -> State -> Update State Msg a
update msg =
    case msg of
        GotFiles files ->
            with .config
                (\{ url, headers } ->
                    setStatus (Uploading 0)
                        >> andThen (setFiles files)
                        >> andAddCmd
                            (Http.request
                                { method = "POST"
                                , url = url
                                , headers = headers
                                , body = Http.multipartBody (List.map (Http.filePart "files[]") files)
                                , expect = Http.expectWhatever Uploaded
                                , timeout = Nothing
                                , tracker = Just "upload"
                                }
                            )
                )

        GotProgress progress ->
            case progress of
                Http.Sending fraction ->
                    setStatus (Uploading (Http.fractionSent fraction))

                Http.Receiving _ ->
                    save

        Uploaded result ->
            case result of
                Ok _ ->
                    setStatus Done

                Err _ ->
                    setStatus Fail


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions state toMsg =
    Sub.map toMsg (Http.track "upload" GotProgress)


onChange : (Msg -> msg) -> Json.Decoder msg
onChange toMsg =
    Json.map (toMsg << GotFiles) filesDecoder


filesDecoder : Json.Decoder (List File)
filesDecoder =
    Json.at [ "target", "files" ] (Json.list File.decoder)
