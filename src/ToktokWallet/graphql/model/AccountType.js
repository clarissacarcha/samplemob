import gql from 'graphql-tag'

export const GET_ACCOUNT_TYPES = gql`
    query {
        getAccountTypes {
            id
            title
            level
            key
            description
            walletSize
            linkLimit
            incomingValueDailyLimit
            incomingValueMonthlyLimit
            incomingValueAnnualLimit
            outgoingValueDailyLimit
            outgoingValueMonthlyLimit
            outgoingValueAnnualLimit
        }
    }
`