module User exposing
    ( User
    , decoder
    , encode
    , fromJson
    , toEmail
    , toString
    )

import Json.Decode as JD
import Json.Encode as JE


type alias User =
    { id : String
    , email : String
    , fullName : String
    , firstName : String
    , lastName : String
    }


fromJson : JD.Value -> Maybe User
fromJson json =
    json
        |> JD.decodeValue decoder
        |> Result.toMaybe


decoder : JD.Decoder User
decoder =
    JD.map5
        (\id email fullName firstName lastName ->
            { id = id
            , email = email
            , fullName = fullName
            , firstName = firstName
            , lastName = lastName
            }
        )
        (JD.oneOf [ JD.field "id" JD.string, JD.field "user_id" JD.string ])
        (JD.field "email" JD.string |> JD.maybe |> JD.map (Maybe.withDefault ""))
        (JD.field "name" JD.string |> JD.maybe |> JD.map (Maybe.withDefault ""))
        (JD.field "family_name" JD.string |> JD.maybe |> JD.map (Maybe.withDefault ""))
        (JD.field "given_name" JD.string |> JD.maybe |> JD.map (Maybe.withDefault ""))


toString : User -> String
toString { id } =
    id


toEmail : User -> String
toEmail { email } =
    email


encode : User -> JE.Value
encode user =
    JE.object
        [ ( "user_id", JE.string user.id )
        ]
