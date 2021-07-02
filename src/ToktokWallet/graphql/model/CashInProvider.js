import gql from 'graphql-tag'

export const GET_CASH_IN_PROVIDERS = gql`
    query {
        getCashInProviders {
            id
            name
            status
        }
    }
`