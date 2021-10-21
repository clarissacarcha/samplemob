import gql from 'graphql-tag'

export const GET_FAVORITES = gql`
    query {
        getFavorites {
            id
            accountId
            status
            favoriteAccount {
                id
                mobileNumber
                person {
                    firstName
                    lastName
                }
            }
        }
    }
`