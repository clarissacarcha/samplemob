import gql from 'graphql-tag'


export const GET_WALLET = gql`
    query {
        getWallet {
            id
            balance
            status
            accountId
            motherId
            currencyId
            currency {
                id
                name
                code
                phpValue
            }
        }
    }
`