import gql from 'graphql-tag'

export const GET_GLOBAL_SETTING = gql`
    query getGlobalSetting($input: GetGlobalSettingInput){
        getGlobalSetting(input: $input) {
            id
            description
            settingKey
            keyValue
            unit
            status
        }
    }
`