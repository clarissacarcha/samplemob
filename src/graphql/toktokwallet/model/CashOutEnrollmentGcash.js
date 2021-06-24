import gql from 'graphql-tag'

const GCashEnrollmentType = `
    id
    mobile
    firstName
    lastName
    streetAddress
    barangayTown
    provinceCity
    country
    birthdate
    accountId
    status
    active
`

export const POST_CASH_OUT_ENROLLMENG_GCASH = gql`
    mutation postCashOutEnrollmentGcash($input: PostCashOutEnrollmentGcashInput){
        postCashOutEnrollmentGcash(input: $input){
            id
            mobile
            status
        }
    }
`

export const GET_CASH_OUT_ENROLLMENT_GCASH = gql`
    query {
        getCashOutEnrollmentGcash {
            linkedGcash {
                id
                accountId
                cashOutEnrollmentGcashId
                origin
                status
                gcashEnrollmentRecord {
                  ${GCashEnrollmentType}
                }
            }
            pendingRecord {
                ${GCashEnrollmentType}
            }
        }
    }
`

export const GET_GCASH_ENROLLMENT_RECORD = gql`
    query getGcashEnrollmentRecord($input: GetGcashEnrollmentRecordInput) {
        getGcashEnrollmentRecord(input: $input){
            ${GCashEnrollmentType}
        }
    }
`

export const GET_GCASH_LINK_OTP = gql`
    query getGcashLinkOTP($input: GetGcashLinkOTPInput){
        getGcashLinkOTP(input: $input){
            message
        }
    }
`


export const PATCH_LINK_ACCOUNT = gql`
    mutation patchLinkAccount($input: PatchLinkAccountInput){
        patchLinkAccount(input: $input){
            message
        }
    }
`

export const PATCH_UNLINK_ACCOUNT = gql`
    mutation patchLinkAccount($input: PatchUnLinkAccountInput){
        patchLinkAccount(input: $input){
            message
        }
    }
`


export const GET_MY_ACCOUNT_GCASH_FILL = gql`
    query {
        getMyAccount {
            id
            mobileNumber
            person {
                id
                firstName
                middleName
                lastName
                birthdate
                emailAddress
                address {
                    line1
                    line2
                    postalCode
                    city {
                        citymunDesc
                    },
                    province {
                        provDesc
                    }
                }
            }
        }
    }
`