import gql from 'graphql-tag'

export const GET_APP_SERVICES = gql`
  query {
    getAppServices {
        id
        service
        displayName
        identifier
        isEnabled
        isEarlyAccess
    }  
}
`

export const GET_APP_SERVICE_LOGS = gql`
  query {
    getAppServiceLogs {
        id
        service
        displayName
        identifier
        isEnabled
        isEarlyAccess
    }  
}
`