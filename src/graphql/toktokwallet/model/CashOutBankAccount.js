import gql from 'graphql-tag'

export const GET_BANK_ACCOUNTS = gql`
    query {
        getBankAccounts {
            id
            accountName
            accountNumber
            nickName
            status
            type
            accountId
            bank {
                id
                name
                code
                accountNumberLength
            }
        }
    }
`

export const POST_CASH_OUT_BANK_ACCOUNT = gql`
    mutation postCashOutBankAccount($input: PostCashOutBankAccountInput){
        postCashOutBankAccount(input: $input){
            id
        }
    }
`

export const PATCH_CASH_OUT_BANK_ACCOUNT = gql`
    mutation patchCashOutBankAccount($input: PatchCashOutBankAccountInput){
        patchCashOutBankAccount(input: $input){
            message
        }
    }
`

export const PATCH_REMOVE_ACCOUNT = gql`
    mutation patchRemoveAccount($input: PatchRemoveAccountInput){
        patchRemoveAccount(input: $input){
            message
        }
    }
`