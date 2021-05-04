module Shared exposing
    ( Flags
    , Model
    , Msg(..)
    , getCred
    , init
    , subscriptions
    , update
    )

import Config exposing (Config)
import Cred exposing (Cred)
import Gen.Route
import Json.Decode as JD
import Request exposing (Request)


type Msg
    = NoOp


type alias Flags =
    JD.Value


type Model
    = WithCred Cred Config
    | NoCred Config
    | Error JD.Error


getCred : Model -> Maybe Cred
getCred model =
    case model of
        WithCred cred _ ->
            Just cred

        NoCred _ ->
            Nothing

        Error _ ->
            Nothing


init : Request -> Flags -> ( Model, Cmd Msg )
init _ flags =
    case ( Cred.fromJson flags, Config.fromJson flags ) of
        ( Just (Result.Ok cred), Result.Ok config ) ->
            ( WithCred cred config, Cmd.none )

        ( Nothing, Result.Ok config ) ->
            ( NoCred config, Cmd.none )

        ( Just (Result.Err error), _ ) ->
            ( Error error, Cmd.none )

        ( _, Result.Err error ) ->
            ( Error error, Cmd.none )


update : Request -> Msg -> Model -> ( Model, Cmd Msg )
update req msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )



-- SignIn cred ->
--     (
--     , Request.pushRoute Gen.Route.Home_ req
--     )
-- SignOut ->
--     ( { model | user = Nothing }, Cmd.none )


subscriptions : Request -> Model -> Sub Msg
subscriptions _ _ =
    Sub.none
