import gql from 'graphql-tag';


export const POST_GCASH_ENCASHMENT = gql`
    mutation postGcashEncashment($input: PostEncashmentInput){
        postGcashEncashment(input: $input){
            message
            cashoutLog {
                id
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