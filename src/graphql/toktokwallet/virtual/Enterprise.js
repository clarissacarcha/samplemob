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