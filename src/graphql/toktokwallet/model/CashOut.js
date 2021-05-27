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