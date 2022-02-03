import gql from 'graphql-tag'

export const GET_CASH_IN_PARTNER_TYPES = gql`
    query {
        getCashInPartnerTypes {
            id
            orderNumber
            name
            transactionTypeId
            status
        }
    }
`