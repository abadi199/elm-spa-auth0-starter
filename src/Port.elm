port module Port exposing
    ( FromJS(..)
    , ToJS(..)
    , receive
    , send
    )

import Json.Decode as JD
import Json.Encode as JE


type ToJS
    = Login
    | Logout


send : ToJS -> Cmd msg
send data =
    case data of
        Login ->
            toJS (JE.object [ ( "kind", JE.string "LOGIN" ) ])

        Logout ->
            toJS (JE.object [ ( "kind", JE.string "LOGOUT" ) ])


type FromJS
    = NoOp


decoder : JD.Decoder FromJS
decoder =
    JD.field "kind" JD.string
        |> JD.andThen
            (\kind ->
                case kind of
                    _ ->
                        JD.fail ("unknown incoming data: " ++ kind)
            )


receive : (Result JD.Error FromJS -> msg) -> Sub msg
receive msg =
    fromJS (\value -> JD.decodeValue decoder value |> msg)


port toJS : JE.Value -> Cmd msg


port fromJS : (JE.Value -> msg) -> Sub msg
