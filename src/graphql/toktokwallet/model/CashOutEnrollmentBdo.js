import gql from 'graphql-tag'

const BDOEnrollmentType = `
            id
            accountNumber
            accountName
            accountCurrency
            accountType
            referenceNumber
            emailAddress
            accountId
            status
            firstName
            middleName
            lastName
            streetAddress
            barangayTown
            provinceCity
            country
            birthdate`

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
                    ${BDOEnrollmentType}
                }
            }
            pendingRecord {
                ${BDOEnrollmentType}
            }
        }
    }
`

export const GET_BDO_ENROLLMENT_RECORD = gql`
    query getBdoEnrollmentRecord($input: GetBdoEnrollmentRecordInput){
         getBdoEnrollmentRecord(input: $input){
           ${BDOEnrollmentType} 
         }
    }
`


export const POST_CASH_OUT_ENROLLMENT_BDO = gql`
    mutation postCashOutEnrollmentBdo($input: PostCashOutEnrollmentBdoInput!){
        postCashOutEnrollmentBdo(input: $input){
            ${BDOEnrollmentType}
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