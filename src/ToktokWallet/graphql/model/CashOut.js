import gql from 'graphql-tag'

export const POST_CASH_OUT = gql`
    mutation postCashOut($input: PostCashOutInput){
        postCashOut(input: $input){
            id
            referenceNumber
            amount
            status
            createdAt
        }
    }
` 

export const POST_REQUEST_CASH_OUT = gql`
    mutation postRequestCashOut($input: PostRequestCashOutInput){
        postRequestCashOut(input: $input){
            message
            requestFundTransferId
            validator
        }
    }
`

export const POST_CASH_OUT_BDO = gql`
    mutation postCashOutBdo($input: PostCashOutInput){
        postCashOutBdo(input: $input){
            id
            referenceNumber
            amount
            status
            createdAt
        }
    }
` 
export const GET_CASH_OUTS = gql`
      query {
        getCashOuts {
                id
                amount
                isExported
                status
                accountId
                currencyId
                cashOutProviderId
                createdAt
                updatedAt
                provider {
                    id
                    name
                }
                # details
                refNo
                referenceNumber
                systemServiceFee
                providerServiceFee
                transaction {
                    id
                    refNo
                    createdAt
                    name
                    phrase
                    details
                }
        }
    }
` 

export const GET_FUND_TRANSFER = gql`
   query getFundTransfer($input:GetFundTransferInput){
    getFundTransfer(input:$input){
        edges {
            cursorCreatedAt
            cursorId
            node {
                    id
                    amount
                    isExported
                    status
                    accountId
                    currencyId
                    cashOutProviderId
                    createdAt
                    updatedAt
                    provider {
                        id
                        name
                    }
                    refNo
                    referenceNumber
                    systemServiceFee
                    providerServiceFee
                    transaction {
                        id
                        refNo
                        createdAt
                        name
                        phrase
                        details
                    }
                
            }
        }
        pageInfo {
            startCursorId
            endCursorId
            hasNextPage
        }
        }
    }
`

export const POST_CASH_OUT_OTHER_BANKS = gql`
      mutation postCashOutOtherBank($input: PostCashOutInput){
        postCashOutOtherBank(input: $input){
            id
            referenceNumber
            amount
            status
            providerServiceFee
            systemServiceFee
            createdAt
            cashOutUbApiLog {
                type
                traceNumber
                remittanceId
            }
        }
      }
`

export const POST_COMPUTE_CONVENIENCE_FEE = gql`
    mutation postComputeConvenienceFee($input: PostComputeConvenienceFeeInput){
        postComputeConvenienceFee(input:$input){
            providerServiceFee
            systemServiceFee
            type
        }
    }
`