module Ui.TagInput exposing (Msg(..), State, component, init, subscriptions, tagInput, update)

import Bootstrap.Badge as Badge
import Bootstrap.Form
import Bootstrap.Form.Input as Input
import Bootstrap.Utilities.Spacing as Spacing
import Browser.Dom as Dom
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Task
import Update.Deep exposing (..)


type Msg
    = SetPadding Float
    | OnInput String
    | AddTag
    | RemoveTag Int
    | NoOp


type alias State =
    { tags : List String
    , value : String
    , padding : Float
    }


addTag : String -> State -> Update State msg a
addTag tag state =
    save { state | tags = tag :: state.tags }


removeTag : Int -> State -> Update State msg a
removeTag ix state =
    save { state | tags = List.take ix state.tags ++ List.drop (ix + 1) state.tags }


setValue : String -> State -> Update State msg a
setValue value state =
    save { state | value = value }


setPadding : Float -> State -> Update State msg a
setPadding padding state =
    save { state | padding = padding }


component : (Msg -> msg) -> Wrap { b | tags : State } msg State Msg a
component msg =
    wrapState
        { get = .tags
        , set = \state tags -> { state | tags = tags }
        , msg = msg
        }


init : Update State msg a
init =
    save State
        |> andMap (save [])
        |> andMap (save "")
        |> andMap (save 0)


updatePadding : Cmd Msg
updatePadding =
    let
        readElement result =
            case result of
                Ok { element } ->
                    SetPadding element.width

                Err _ ->
                    SetPadding 0
    in
    Dom.getElement "taginput-taglist" |> Task.attempt readElement


update : { onChange : List String -> a } -> Msg -> State -> Update State Msg a
update { onChange } msg =
    let
        notifyChanged =
            with .tags (applyCallback << onChange)
    in
    case msg of
        OnInput value ->
            setValue value

        SetPadding width ->
            setPadding width

        AddTag ->
            with .value addTag
                >> andAddCmd updatePadding
                >> andThen notifyChanged
                >> andThen (setValue "")

        RemoveTag ix ->
            removeTag ix
                >> andAddCmd updatePadding
                >> andThen notifyChanged

        NoOp ->
            save


subscriptions : State -> (Msg -> msg) -> Sub msg
subscriptions state toMsg =
    Sub.none


handleKeydown : String -> String -> { message : Msg, stopPropagation : Bool, preventDefault : Bool }
handleKeydown value inp =
    if "Tab" == inp && not (String.isEmpty value) then
        { message = AddTag
        , stopPropagation = False
        , preventDefault = True
        }

    else if "Backspace" == inp && String.isEmpty value then
        { message = RemoveTag 0
        , stopPropagation = False
        , preventDefault = False
        }

    else
        { message = NoOp
        , stopPropagation = False
        , preventDefault = False
        }


tagInput : State -> (Msg -> msg) -> List (Input.Option Msg) -> String -> Bool -> Html msg
tagInput { tags, padding, value } toMsg options feedback disabled =
    let
        badge ix tag =
            Badge.badgePrimary
                [ Spacing.ml1
                , style "cursor" "pointer"
                , onClick
                    (if disabled then
                        NoOp

                     else
                        RemoveTag ix
                    )
                ]
                [ text tag
                , text " "
                , text "×"
                ]

        paddingLeft =
            if List.isEmpty tags then
                ".75rem"

            else
                String.fromFloat padding ++ "px"

        onKeydown =
            Json.map (handleKeydown value) (Json.field "key" Json.string)
    in
    div []
        [ div
            [ id "taginput-taglist"
            , style "padding" ".4em"
            , style "position" "absolute"
            ]
            (List.reverse <| List.indexedMap badge tags)
        , Input.text
            ([ Input.onInput OnInput
             , Input.value value
             , Input.attrs
                [ style "padding-left" paddingLeft
                , custom "keydown" onKeydown
                , class "form-control"
                , onBlur (OnInput "")
                ]
             ]
                ++ options
            )
        , Bootstrap.Form.invalidFeedback [] [ text feedback ]
        ]
        |> Html.map toMsg
