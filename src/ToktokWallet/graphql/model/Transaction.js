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
refNo
name
phrase
displayInfo
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

export const POST_VERIFY_TRANSACTION_QR_CODE = gql`
    mutation postVerifyTransactionQrCode($input: PostVerifyTransactionQrCodeInput){
        postVerifyTransactionQrCode(input: $input){
            account {
                id
                mobileNumber
                status
                motherId
                person {
                    id
                    firstName
                    middleName
                    lastName
                }
            }
            QRInfo
        }
    }
`

export const GET_ENTERPRISE_TRANSACTIONS = gql`
    query getEnterpriseTransactions($input: GetEnterpriseTransactionsInput) {
        getEnterpriseTransactions(input: $input) {
            ${WalletTransactions}
        }
    }
`

export const GET_SEND_MONEY_TRANSACTIONS = gql`
    query {
        getSendMoneyTransactions {
            ${WalletTransactions}
        }
    }
`
