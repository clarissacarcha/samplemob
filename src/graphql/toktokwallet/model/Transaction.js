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

export const GET_TRANSACTIONS = gql`
    query getTransactions($input: GetTransactionsInput) {
       getTransactions(input: $input) {
            recentTransactions {
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
                                code
                            }
                        }
                        gcashInfo {
                            accountNumber
                            accountName
                        }
                        bdoInfo {
                            accountNumber
                            accountName
                        }
                    }
            }
            allTransactions {
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
                                code
                            }
                        }
                        gcashInfo {
                            accountNumber
                            accountName
                        }
                        bdoInfo {
                            accountNumber
                            accountName
                        }
                    }
            }
       }
    }
`