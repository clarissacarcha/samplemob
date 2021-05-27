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