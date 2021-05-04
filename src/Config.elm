module Config exposing (Config, fromJson)

import Json.Decode as JD


type alias Config =
    { apiUrl : String }


fromJson : JD.Value -> Result JD.Error Config
fromJson json =
    Result.map Config
        (JD.decodeValue (JD.field "api_url" JD.string) json)
