import gql from 'graphql-tag'


export const GET_ACCOUNT = gql`
    query getAccount($input: GetAccountInput){
        getAccount(input: $input){
            id
            mobileNumber
            status
            motherId
            person {
                id
                firstName
                middleName
                lastName
            }
        }
    }
`

export const GET_MY_ACCOUNT = gql`
    query {
        getMyAccount {
            id
            mobileNumber
            status
            motherId
            pinCode
            pinCodeAttempts
            person {
                id
                firstName
                middleName
                lastName
                birthdate
                emailAddress
                accountType {
                    title
                    level
                    key
                }
            }
            wallet {
                id
                balance
                status
                accountId
                motherId
                currencyId
                currency {
                    id
                    name
                    code
                    phpValue
                }
            }
        }
    }
`

export const PATCH_PIN_CODE = gql`
    mutation patchPinCode($input: PatchPinCodeInput){
        patchPinCode(input: $input)
    }
`

export const VERIFY_PIN_CODE = gql`
    query verifyPinCode($input: GetVerifyPinInput){
        verifyPinCode(input: $input)
    }
`

export const GET_FORGOT_AND_RECOVER_OTP_CODE = gql`
    query {
        getForgotAndRecoverOTPCode {
            message
        }
    }
`

export const VERIFY_FORGOT_AND_RECOVER_OTP_CODE = gql`
    query verifyForgotAndRecoverOTP($input: VerifyForgotAndRecoverOTPInput){
        verifyForgotAndRecoverOTP(input: $input){
            message
        }
    }
`