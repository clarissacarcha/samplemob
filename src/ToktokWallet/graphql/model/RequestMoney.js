import gql from 'graphql-tag';

const RequestMoney = `
id
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
note
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
        postApprovedRequestMoney(input: $input)
    }
`