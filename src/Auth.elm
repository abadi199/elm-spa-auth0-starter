module Auth exposing
    ( User
    , beforeProtectedInit
    )

{-|

@docs User
@docs beforeProtectedInit

-}

import Cred exposing (Cred)
import ElmSpa.Page as ElmSpa
import Gen.Route exposing (Route)
import Request exposing (Request)
import Shared


{-| Replace the "()" with your actual User type
-}
type alias User =
    Cred


beforeProtectedInit : Shared.Model -> Request -> ElmSpa.Protected Cred Route
beforeProtectedInit shared req =
    case Shared.getCred shared of
        Just cred ->
            ElmSpa.Provide cred

        Nothing ->
            ElmSpa.RedirectTo Gen.Route.SignIn
