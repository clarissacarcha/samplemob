import gql from 'graphql-tag';


export const POST_GCASH_ENCASHMENT = gql`
    mutation postGcashEncashment($input: PostEncashmentInput){
        postGcashEncashment(input: $input){
            message
            cashoutLog {
                id
                referenceNumber
                tokDisbursementBatchId
                tokUserId
                totalAmount
                gcashMobileNumber
                gcashFirstName
                gcashLastName
                gcashStreetAddress
                gcashBirthdate
                status  
                remarks
                createdAt
                updatedAt
            }
        }
    }
`

export const GET_CASH_OUT_LOGS = gql`
    query getCashOutLogs($input: GetCashOutLogsInput){
        getCashOutLogs(input: $input){
            logDate
            logs {
                id
                referenceNumber
                tokDisbursementBatchId
                tokUserId
                totalAmount
                gcashMobileNumber
                gcashFirstName
                gcashLastName
                gcashStreetAddress
                gcashBirthdate
                status    
                remarks
                createdAt
                updatedAt
                trails {
                    id
                    status
                    tokToktokWalletLogTypeId
                    tokToktokWalletCashOutId
                    createdAt
                }
            }
        }
    }
`

export const GET_INTERNAL_ACCOUNT = gql`
    query getInternalAccount($input: GetToktokWalletInternalAccountInput){
        getInternalAccount(input: $input){
            id
            name
            isProvider
            image
            tokUserId
            cashInLimit
            cashOutLimit
        }
    }
`