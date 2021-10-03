import gql from 'graphql-tag'

export const POST_CASH_OUT = gql`
    mutation postCashOut($input: PostCashOutInput){
        postCashOut(input: $input){
            id
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
                cashOutDisplayInformations {
                    accountInfo {
                            accountNumber
                            accountName
                            bank {
                                name 
                            }
                    }
                }
        }
    }
` 

export const POST_CASH_OUT_OTHER_BANKS = gql`
      mutation postCashOutOtherBank($input: PostCashOutInput){
        postCashOutOtherBank(input: $input){
            id
            amount
            status
            createdAt
        }
      }
`