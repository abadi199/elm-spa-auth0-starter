module Pages.Home_ exposing (Model, Msg, page)

import Cred exposing (Cred)
import Effect exposing (Effect)
import Gen.Params.Home_ exposing (Params)
import Page
import Request
import Shared
import View exposing (View)


page : Shared.Model -> Request.With Params -> Page.With Model Msg
page shared req =
    Page.protected.advanced
        (\cred ->
            { init = init
            , update = update
            , view = view cred
            , subscriptions = subscriptions
            }
        )



-- INIT


type alias Model =
    {}


init : ( Model, Effect Msg )
init =
    ( {}, Effect.none )



-- UPDATE


type Msg
    = ReplaceMe


update : Msg -> Model -> ( Model, Effect Msg )
update msg model =
    case msg of
        ReplaceMe ->
            ( model, Effect.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Cred -> Model -> View Msg
view cred model =
    View.placeholder <| "Welcome, " ++ Cred.toString cred
