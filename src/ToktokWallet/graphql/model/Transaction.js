import gql from 'graphql-tag'

export const POST_FUND_TRANSFER = gql`
    mutation postFundTransfer($input: PostFundTransferInput){
        postFundTransfer(input: $input){
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

export const POST_REQUEST_SEND_MONEY = gql`
    mutation postRequestSendMoney($input: PostRequestSendMoneyInput){
        postRequestSendMoney(input:$input){
            message
            requestSendMoneyId
            validator
        }
    }
`

export const POST_SEND_MONEY = gql`
    mutation postSendMoney($input: PostSendMoneyInput){
        postSendMoney(input:$input){
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

export const GET_OUTGOING_TRANSFER = gql`
    query {
        getOutgoingTransfer {
            id
            amount
            status
            createdAt
            note
            destinationPerson {
                firstName
                lastName
                middleName
            }
            destinationWallet {
                account {
                    mobileNumber
                }
            }
        }
    }
`

const WalletTransactions = `
id
amount
note
status
sourceWalletId
destinationWalletId
cashInId
cashOutId
createdAt
externalName
externalPhrase
externalReferenceNumber
externalPayload
externalDetails
sourcePerson {
    firstName
    middleName
    lastName
}
destinationPerson {
    firstName
    middleName
    lastName
}
sourceAccount {
    mobileNumber
}
destinationAccount {
    mobileNumber
}
transactionType {
    name
    type
    sourcePhrase
    destinationPhrase
}
cashOutDisplayInformations {
    accountInfo {
        accountNumber
        accountName
        bank {
            name 
        }
    }
}
`

export const GET_TRANSACTIONS = gql`
    query {
       getTransactions {
            recentTransactions {
                ${WalletTransactions}
            }
            allTransactions {
                ${WalletTransactions}
            }
       }
    }
`