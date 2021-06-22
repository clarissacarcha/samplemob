import gql from 'graphql-tag'

export const GET_CASH_OUT_ENROLLMENT_BDO = gql`
    query {
        getCashOutEnrollmentBdo {
            linkedBDO {
                id
                accountId
                cashOutEnrollmentBdoId
                origin
                status
                bdoEnrollmentRecord {
                    id
                    accountNumber
                    accountName
                    accountCurrency
                    accountType
                    referenceNumber
                    emailAddress
                    accountId
                    status
                }
            }
            pendingRecord {
                id
                accountNumber
                accountName
                accountCurrency
                accountType
                referenceNumber
                emailAddress
                accountId
                status
            }
        }
    }
`

export const GET_BDO_ENROLLMENT_RECORD = gql`
    query getBdoEnrollmentRecord($input: GetBdoEnrollmentRecordInput){
         getBdoEnrollmentRecord(input: $input){
            id
            accountNumber
            accountName
            accountCurrency
            accountType
            referenceNumber
            emailAddress
            accountId
            status
         }
    }
`


export const POST_CASH_OUT_ENROLLMENT_BDO = gql`
    mutation postCashOutEnrollmentBdo($input: PostCashOutEnrollmentBdoInput!){
        postCashOutEnrollmentBdo(input: $input){
            id
            accountNumber
            accountName
            accountCurrency
            accountType
            referenceNumber
            emailAddress
            accountId
            status
        }
    }
`

export const GET_BDO_LINK_OTP = gql`
    query getBdoLinkOTP($input: GetBdoLinkOTPInput){
        getBdoLinkOTP(input: $input){
            message
        }
    }
`

export const PATCH_LINK_BDO_ACCOUNT = gql`
    mutation patchLinkBdoAccount($input: PatchLinkBdoAccountInput\!){
        patchLinkBdoAccount(input: $input){
            message
        }
    }
`