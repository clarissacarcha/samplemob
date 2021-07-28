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

export const GET_CASH_OUT_PROVIDER_OTHER_BANKS = gql`
   query {
       getCashOutProviderOtherBanks {
            id
            name
            status
        }
    }
`