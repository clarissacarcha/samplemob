import gql from 'graphql-tag'


export const GET_WALLET = gql`
    query {
        getWallet {
            id
            balance
            creditCardBalance
            totalBalance
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

export const POST_CHECK_INCOMING_WALLET_LIMIT = gql`
    mutation postCheckIncomingWalletLimit($input: CheckLimitInput){
        postCheckIncomingWalletLimit(input: $input){
            message
        }
    }
`

export const POST_CHECK_OUTGOING_WALLET_LIMIT = gql`
    mutation postCheckOutgoingWalletLimit($input: CheckLimitInput){
        postCheckOutgoingWalletLimit(input: $input){
            message
        }
    }
`