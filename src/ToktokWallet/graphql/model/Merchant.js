import gql from "graphql-tag";

export const POST_VERIFY_MERCHANT_QR_CODE = gql`
    mutation postVerifyMerchantQrCode($input: PostVerifyMerchantQrCodeInput){
        postVerifyMerchantQrCode(input: $input){
            merchant {
                id
                logo
                merchantCode
                merchantName
                serviceFee
                wTax
                paymentType
            }
            branch {
                id
                branchCode
                branchName
                serviceFee
                wTax
            }
            terminal {
                id
                terminalCode
                terminalName
            }
            status
            message
        }   
    }
`

export const POST_MERCHANT_PAYMENT = gql`
    mutation postMerchantPayment($input: PostMerchantPaymentInput){
        postMerchantPayment(input: $input){
            id
            createdAt
            amount
            serviceFee
            paymentType
            serviceFeeAmount
            transaction {
                id
                refNo
                createdAt
                amount
            }
        }
    }
`

export const GET_MERCHANT_PAYMENTS = gql`
    query {
        getMerchantPayments {
            id
            createdAt
            amount
            serviceFee
            paymentType
            serviceFeeAmount
            transaction {
                id
                refNo
                createdAt
                amount
                name
                phrase
            }
        }
    }
`
export const GET_MERCHANT_SETTLEMENT = gql`
  query getMerchantSettlements($input: GetMerchantSettlementsInput) {
    getMerchantSettlements(input: $input) {
      edges{
        node {
            id
            refNo
            name
            phrase
            createdAt
            updatedAt
            displayInfo
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

export const POST_REQUEST_MERCHANT_PAYMENT = gql`
    mutation {
        postRequestMerchantPayment
    }
`
