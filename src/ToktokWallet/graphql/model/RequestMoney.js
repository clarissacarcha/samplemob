import gql from 'graphql-tag';

const RequestMoney = `
id
referenceNumber
refNo
destinationAccountId
destinationPersonId
destinationWalletId
sourceAccountId
sourcePersonId
sourceWalletId
destinationAccount {
    id
    mobileNumber
}
sourceAccount {
    id
    mobileNumber
}
destinationPerson {
    firstName
    middleName
    lastName
}
sourcePerson {
    firstName
    middleName
    lastName
}
amount
destinationRemarks
sourceRemarks
status
isViewed
createdAt
updatedAt
`

export const GET_REQUEST_MONEY_PENDING_RECEIVED_COUNT = gql`
    query {
        getRequestMoneyPendingReceived {
            id
            isViewed
        }
    }
`

export const GET_REQUEST_MONEY_PENDING_RECEIVED = gql`
    query {
        getRequestMoneyPendingReceived {
            ${RequestMoney}
        }
    }
`

export const GET_REQUEST_MONEY_PENDING_SENT = gql`
    query {
        getRequestMoneyPendingSent {
            ${RequestMoney}
        }
    }
`

export const GET_REQUEST_MONEY_HISTORY = gql`
    query getRequestMoneyHistory($input: GetRequestMoneyHistoryInput){
        getRequestMoneyHistory(input: $input){
            ${RequestMoney}
            transaction {
                id
                # details
                refNo
                amount
            }
        }
    }
`

export const POST_REQUEST_MONEY = gql`
    mutation postRequestMoney($input: PostRequestMoneyInput){
        postRequestMoney(input: $input)
    }
`

export const POST_REQUEST_APPROVE_REQUEST_MONEY = gql`
    mutation postRequestApproveRequestMoney($input: PostRequestApproveRequestMoneyInput){
        postRequestApproveRequestMoney(input: $input){
            message
            requestRequestMoneyId
            validator
        }
    }
`

export const POST_APPROVED_REQUEST_MONEY = gql`
    mutation postApprovedRequestMoney($input: PostApprovedRequestMoneyInput){
        postApprovedRequestMoney(input: $input){
            id
            amount
            status
            sourceWalletId
            destinationWalletId
            sourcePersonId
            destinationPersonId
            transactionTypeId
        }
    }
`

export const POST_DENIED_REQUEST_MONEY = gql`
    mutation postDeniedRequestMoney($input: PostDeniedRequestMoneyInput){
        postDeniedRequestMoney(input: $input)
    }
`

export const PATCH_DELETE_REQUEST_MONEY = gql`
    mutation patchDeleteRequestMoney($input: PatchDeleteRequestMoneyInput){
        patchDeleteRequestMoney(input: $input){
            message
        }
    }
`