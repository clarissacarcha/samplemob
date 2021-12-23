import gql from 'graphql-tag'


// export const GET_ACCOUNT = gql`
//     query getAccount($input: GetAccountInput){
//         getAccount(input: $input){
//             id
//             mobileNumber
//             status
//             motherId
//             person {
//                 id
//                 firstName
//                 middleName
//                 lastName
//             }
//         }
//     }
// `

export const GET_ACCOUNT = gql`
    query getAccount($input: GetAccountInput){
        getAccount(input: $input){
            id
            mobileNumber
            person
        }
    }
`

export const GET_MY_ACCOUNT = gql`
    query {
        getMyAccount {
            id
            mobileNumber
            status
            disabledType
            isDormant
            motherId
            pinCode
            pinCodeAttempts
            mpinCode
            mpindCodeAttempts
            isLinked
            person {
                id
                firstName
                middleName
                lastName
                birthdate
                emailAddress
                gender
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

export const PATCH_MPIN_CODE = gql`
    mutation patchMPinCode($input: PatchMPinCodeInput){
        patchMPinCode(input: $input)
    }
`

export const VERIFY_PIN_CODE = gql`
    query verifyPinCode($input: GetVerifyPinInput){
        verifyPinCode(input: $input)
    }
`

export const GET_VERIFY_MPIN = gql`
    query getVerifyMPIN($input: GetVerifyMPINInput){
        getVerifyMPIN(input: $input){
            verifiedToken
        }
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

export const GET_CHECK_PENDING_DISBURSEMENT_ACCOUNT = gql`
    query {
        getCheckPendingDisbursementAccount {
            result
        }
    }
`

export const POST_GENERATE_ACCOUNT_QR_CODE = gql`
    mutation {
        postGenerateAccountQrCode {
            encryptedQRToken
        }
    }
`