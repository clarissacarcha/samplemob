import gql from 'graphql-tag'

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
            id
            mobile
            firstName
            lastName
            status
            active
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