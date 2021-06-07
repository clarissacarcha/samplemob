import gql from 'graphql-tag'

export const POST_CASH_IN_PAYPANDA_REQUEST = gql`
    mutation postCashInPayPandaRequest($input: PostCashInPayPandaRequestInput){
        postCashInPayPandaRequest(input: $input){
            signature
            merchantId
            refNo
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
    query getCashIns($input: GetCashInsInput) {
        getCashIns(input: $input) {
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
        }
    }
`