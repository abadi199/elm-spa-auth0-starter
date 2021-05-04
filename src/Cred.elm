module Cred exposing
    ( Cred
    , fromJson
    , toString
    , toUser
    , token
    )

import Json.Decode as JD
import Token exposing (Token)
import User exposing (User)


type Cred
    = Cred User Token


fromJson : JD.Value -> Maybe (Result JD.Error Cred)
fromJson json =
    JD.decodeValue (JD.field "token" Token.decoder) json
        |> Result.toMaybe
        |> Maybe.map
            (\tkn ->
                JD.decodeValue User.decoder json |> Result.map (\user -> Cred user tkn)
            )


toUser : Cred -> User
toUser (Cred user _) =
    user


toString : Cred -> String
toString (Cred user _) =
    "User: " ++ User.toEmail user


token : Cred -> Token
token (Cred _ token_) =
    token_
