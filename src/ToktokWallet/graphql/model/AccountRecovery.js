import gql from 'graphql-tag'

export const GET_ACCOUNT_RECOVERY = gql`
    query {
        getAccountRecovery {
            id
            accountId
            questions
            answers
            status
        }
    }
`

export const POST_ACCOUNT_RECOVERY = gql`
    mutation postAccountRecovery($input: PostAccountRecoveryInput){
        postAccountRecovery(input: $input){
            id
            accountId
            questions
            answers
            status
        }
    }
`