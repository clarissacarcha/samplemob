import gql from 'graphql-tag'

export const GET_CALL_CHANNELS = gql`
    query {
        getCallChannels {
            id
            channelName
            logo
            contactDescription
            status
        }
    }
`