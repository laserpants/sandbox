module Helpers.Table exposing (highlightQuery)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


highlightQuery : String -> String -> Html msg
highlightQuery query input =
    case query of
        "" ->
            text input

        _ ->
            let
                queryLength =
                    String.length query

                indexes =
                    String.indexes (String.toLower query) (String.toLower input)

                fun ix ( str, strs, prev ) =
                    let
                        wordLength =
                            ix - prev

                        tokenLength =
                            wordLength + queryLength

                        strs_ =
                            String.slice wordLength tokenLength str :: String.left wordLength str :: strs
                    in
                    ( String.dropLeft tokenLength str, strs_, ix + queryLength )

                ( head, tail, _ ) =
                    List.foldl fun ( input, [], 0 ) indexes

                pairs xs =
                    case xs of
                        fst :: snd :: rest ->
                            ( fst, snd ) :: pairs rest

                        fst :: [] ->
                            [ ( fst, "" ) ]

                        _ ->
                            []

                htmlPairs ( slice, query_ ) =
                    [ text slice, b [] [ text query_ ] ]
            in
            span [] (head :: tail |> List.reverse |> pairs |> List.concatMap htmlPairs)
