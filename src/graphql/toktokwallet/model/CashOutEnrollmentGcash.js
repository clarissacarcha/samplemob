import gql from 'graphql-tag'
import { exp } from 'react-native-reanimated'

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
            }
            pendingRecord {
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
            }
        }
    }
`

export const GET_GCASH_ENROLLMENT_RECORD = gql`
    query getGcashEnrollmentRecord($input: GetGcashEnrollmentRecordInput) {
        getGcashEnrollmentRecord(input: $input){
            id
            mobile
            firstName
            lastName
            status
            active
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