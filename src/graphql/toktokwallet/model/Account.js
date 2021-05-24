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

export const GET_MY_ACCOUNT = gql`
    query {
        getMyAccount {
            id
            mobileNumber
            status
            motherId
            person {
                id
                firstName
                middleName
                lastName
                emailAddress
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