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
