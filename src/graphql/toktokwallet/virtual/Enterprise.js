import gql from 'graphql-tag';

export const GET_COUNTRIES = gql`
    query {
        getCountries {
            id
            numCode
            alpha2Code
            alpha3Code
            name
            nationality
        }
    }
`

export const GET_PROVINCES = gql`
    query {
        getProvinces {
            id
            provDesc
            provCode
        }
    }  
`

export const GET_CITIES = gql`
    query getCities ( $input: GetCitiesInput ) {
        getCities( input: $input ) {
            id
            citymunDesc
            citymunCode
        }
    }
`

export const GET_IDENTIFICATION_CARDS = gql`
    query {
        getIdentificationCards {
            id
            isBackRequired
            name
        }
    }
`

export const POST_KYC_REGISTER = gql`
    mutation postKycRegister($input: PostKycRegisterInput){
        postKycRegister(input: $input){
            id
            status
        }
    }
`

export const GET_CHECK_ACCOUNT = gql`
    query getCheckAccount($input: GetCheckAccountInput){
        getCheckAccount(input: $input){
            id
            mobileNumber
            status
            motherId
            person {
                id
                accountType {
                    linkLimit
                }
            }
        }
    }
`


export const GET_LINK_ACCOUNT_OTP = gql`
     query getLinkAccountOTP($input: GetLinkAccountOTPInput){
         getLinkAccountOTP(input: $input){
             message
         }
     }
`

export const VERIFY_LINK_ACCOUNT_OTP = gql`
    query verifyLinkAccountOTP($input: VerifyLinkAccountOTPInput){
        verifyLinkAccountOTP(input: $input){
            message
        }
    }
`