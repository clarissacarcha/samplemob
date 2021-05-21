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