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
export const GET_CASH_OUTS = gql`
      query {
        getCashOuts {
            logDate
            logs {
                id
                amount
                isExported
                status
                accountId
                currencyId
                cashOutProviderId
                createdAt
                updatedAt
            }
        }
    }
` 