import gql from 'graphql-tag'

export const GET_BANKS = gql`
    query {
        getBanks {
            id
            name
            code
            status
            accountNumberLength
            accountNameLength
            addressLength
        }
    }
`