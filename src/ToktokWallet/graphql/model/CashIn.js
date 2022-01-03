import gql from 'graphql-tag'

export const POST_CASH_IN_PAYPANDA_REQUEST = gql`
    mutation postCashInPayPandaRequest($input: PostCashInPayPandaRequestInput){
        postCashInPayPandaRequest(input: $input){
            signature
            merchantId
            refNo
            paypandaTransactionEntryEndpoint
            paypandaReturnUrlEndpoint
        }
    }
`

export const POST_CASH_IN_SMS = gql`
    mutation postCashInSms($input: PostCashInSmsInput){
        postCashInSms(input: $input){
            message
        }
    }
`

export const GET_CASH_INS = gql`
    query {
        getCashIns {
                id
                amount
                referenceNumber
                providerReferenceNumber
                status
                accountId
                currencyId
                cashInProviderId
                fatherId
                createdAt
                updatedAt
                provider {
                    id
                    name
                }
                transaction {
                    id
                    refNo
                    createdAt
                }
        }
    }
`

export const POST_REQUEST_CASH_IN = gql`
    mutation {
        postRequestCashIn
    }
`