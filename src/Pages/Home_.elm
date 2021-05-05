module Pages.Home_ exposing (Model, Msg, page)

import Cred exposing (Cred)
import Effect exposing (Effect)
import Gen.Params.Home_ exposing (Params)
import Html
import Html.Events
import Page
import Port
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
    = ClickedSignOut


update : Msg -> Model -> ( Model, Effect Msg )
update msg model =
    case msg of
        ClickedSignOut ->
            ( model, Port.send Port.Logout |> Effect.fromCmd )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Cred -> Model -> View Msg
view cred model =
    { title = "Elm Spa Auth0 Starter"
    , body =
        [ Html.h1 [] [ Html.text ("Welcome, " ++ Cred.toString cred) ]
        , Html.button [ Html.Events.onClick ClickedSignOut ] [ Html.text "Logout" ]
        ]
    }
