import gql from 'graphql-tag'

export const GET_APP_SERVICES = gql`
  query {
    getAppServices {
        id
        type
        service
        displayOrder
        displayName
        identifier
        isEnabled
        isEarlyAccess
    }  
}
`