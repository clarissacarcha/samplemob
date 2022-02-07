import gql from 'graphql-tag'

export const GET_ACCOUNT_RECOVERY = gql`
    query {
        getAccountRecovery {
            id
            accountId
            answer
            accountRecoveryQuestionId
            accountRecoveryQuestion {
                id
                question
                isDatepicker
            }
            status
        }
    }
`

export const POST_ACCOUNT_RECOVERY = gql`
    mutation postAccountRecovery($input: PostAccountRecoveryInput){
        postAccountRecovery(input: $input)
    }
`

export const POST_REQUEST_ACCOUNT_RECOVERY_OTP = gql`
    mutation {
        postRequestAccountRecoveryOTP {
            message
        }
    }
`

export const PATCH_RECOVER_ACCOUNT = gql`
    mutation {
        patchRecoverAccount {
            message
        }
    }
`

export const GET_ACCOUNT_RECOVERY_QUESTIONS = gql`
    query {
        getAccountRecoveryQuestions {
            id
            question
            status
            isDatepicker
            maxLength
        }
    }
`