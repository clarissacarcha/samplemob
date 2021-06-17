import gql from 'graphql-tag'

export const GET_CASH_OUT_ENROLLMENT_BDO = gql`
    query {
        getCashOutEnrollmentBdo {
            linkedBDO {
                id
                accountId
                cashOutEnrollmentBdoId
                origin
                status
                bdoEnrollmentRecord {
                    id
                    accountNumber
                    accountName
                    accountCurrency
                    accountType
                    referenceNumber
                    emailAddress
                    accountId
                    status
                }
            }
            pendingRecord {
                id
                accountNumber
                accountName
                accountCurrency
                accountType
                referenceNumber
                emailAddress
                accountId
                status
            }
        }
    }
`