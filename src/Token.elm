module Token exposing
    ( Token
    , decoder
    , toHeader
    , toString
    )

import Http
import Json.Decode as JD


type Token
    = Token String


toString : Token -> String
toString (Token token) =
    token


decoder : JD.Decoder Token
decoder =
    JD.string |> JD.map Token


toHeader : Token -> Http.Header
toHeader (Token token) =
    Http.header "Authorization" ("Bearer " ++ token)
