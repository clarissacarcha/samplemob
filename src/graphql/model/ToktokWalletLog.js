import gql from 'graphql-tag';


const WALLET_LOG = `
logDate
logs {
    id
    referenceNumber
    amount
    type
    createdAt
    sourceUserId
    destinationUserId
    status
    logType {
        transferType
        sourceAccountType
        destinationAccountType
        label
        key
        sourcePhrase
        destinationPhrase
    }
    sourceInfo {
        username
        firstName
        middleName
        lastName
        internalAccount
    }
    destinationInfo {
        username
        firstName
        middleName
        lastName
        internalAccount
    }
    delivery {
        deliveryId
    }
}`

export const GET_TOKTOK_WALLET_RECENT_LOGS = gql`
  query getToktokWalletRecentLogs($input: GetToktokWalletLogsInput){
    getToktokWalletRecentLogs(input: $input){
        ${WALLET_LOG}
    }
  }
`

export const GET_TOKTOK_WALLET_LOGS = gql`
  query getToktokWalletLogs($input: GetToktokWalletLogsInput){
    getToktokWalletLogs(input: $input){
        ${WALLET_LOG}
    }
  }
`

export const GET_RECENT_OUTGOING_TRANSFER = gql`
  query {
    getRecentOutgoingTransfer {
      id
      referenceNumber
      amount
      createdAt
      destinationInfo {
        username
        firstName
        middleName
        lastName
        internalAccount
    }
    }
  }
`

const dailyMonthlyYearly = `
  daily
  monthly
  yearly
  walletbalance
  walletlimit {
    id
    walletSize
    incomingValueDailyLimit
    incomingValueMonthlyLimit
    incomingValueAnnualLimit
    outgoingValueDailyLimit
    outgoingValueMonthlyLimit
    outgoingValueAnnualLimit
  }
`

export const GET_DAILY_MONTHLY_YEARLY_INCOMING = gql`
  query getDailyMonthlyYearlyIncoming($input: GetDailyMonthlyYearlyInput){
      getDailyMonthlyYearlyIncoming(input: $input){
        ${dailyMonthlyYearly}
      }
  }
`

export const GET_DAILY_MONTHLY_YEARLY_OUTGOING= gql`
  query getDailyMonthlyYearlyOutgoing($input: GetDailyMonthlyYearlyInput){
    getDailyMonthlyYearlyOutgoing(input: $input){
         ${dailyMonthlyYearly}
      }
  }
`