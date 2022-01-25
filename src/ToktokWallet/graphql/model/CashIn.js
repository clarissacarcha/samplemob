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
                details
                transaction {
                    id
                    refNo
                    createdAt
                }
                paymentMethod
                cashInPartnerTypeId
                cashInPartnerType {
                    id
                    name
                    transactionTypeId
                    status
                }
        }
    }
`

export const POST_REQUEST_CASH_IN = gql`
    mutation {
        postRequestCashIn
    }
`

export const GET_DRAGON_PAY_CASH_IN_METHODS =gql`
    query {
        getDragonPayCashInMethods {
            onlineBank
            otcBank
            otcNonBank
        }
    }
`


export const POST_COMPUTE_PROCESSING_FEE = gql`
    mutation postComputeProcessingFee($input: PostComputeProcessingFeeInput){
        postComputeProcessingFee(input: $input){
            partner
            processingFee
            currency
            newAmount
            newAmountString
            rf
            rp
        }
    }
`