import gql from 'graphql-tag'

export const GET_CASH_OUT_PROVIDERS = gql`
    query {
        getCashOutProviders {
            id
            name
            status
        }
    }
`