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

export const GET_OUTGOING_TRANSFER = gql`
    query {
        getOutgoingTransfer {
            id
            amount
            status
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

export const GET_TRANSACTIONS = gql`
    query {
       getTransactions {
            recentTransactions {
                logDate
                logs {
                    id
                    amount
                    note
                    status
                    sourceWalletId
                    destinationWalletId
                    cashInId
                    cashOutId
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
                    transactionType {
                        name
                        type
                        sourcePhrase
                        destinationPhrase
                    }
                }
            }
            allTransactions {
                logDate
                logs {
                    id
                    amount
                    note
                    status
                    sourceWalletId
                    destinationWalletId
                    cashInId
                    cashOutId
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
                    transactionType {
                        name
                        type
                        sourcePhrase
                        destinationPhrase
                    }
                }
            }
       }
    }
`