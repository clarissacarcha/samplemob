import gql from 'graphql-tag'

export const GET_ID_CARDS  = gql`
    query {
        getIDCards {
            id
            isBackRequired
            name
        }
    }
`