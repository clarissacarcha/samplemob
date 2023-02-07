import gql from 'graphql-tag';

const transaction = `
  id
  referenceNumber
  senderName
  senderMobileNumber
  destinationNumber
  destinationIdentifier
  billerDetails {
    id
    name
    logo
    descriptions
    firstFieldName
    secondFieldName
    itemCode
  }
  loadDetails {
    id
    name
    networkDetails {
      id
      name
    }
  }
  senderWalletBalance
  amount
  senderWalletEndingBalance
  convenienceFee
  discount
  type
  status
  tokUserId
  ofps
  toktokServiceCommission
  startUp
  mcjr
  mcsuper
  jc
  mc
  mcmeg
  others
  providerComValue
  systemServiceFee
  providerServiceFee
  providerComRate
  comType
  createdAt
  transactionPagibigBill{
    accountNumber
    contactNumber
    perCov1
    perCov2
    billsPagibigPaymentType {
      description
    }
  }
  transactionSSSBill {
    prn
    billsSSSMembershipType {
      description
    }
  }
`;

export const GET_TRANSACTIONS_BY_STATUS = gql`
  query getTransactionsByStatus($input: GetTransactionsByStatusInput!) {
    getTransactionsByStatus(input: $input) {
      ${transaction}
    }
  }
`;
export const GET_BILL_TRANSACTIONS = gql`
  query getTransactions($input: GetTransactionsInput!) {
    getTransactions(input: $input) {
      ${transaction}
    }
  }
`;
export const GET_BILL_TRANSACTIONS_PAGINATE = gql`
  query getTransactionsPaginate($input: GetTransactionsPaginateInput!) {
    getTransactionsPaginate(input: $input) {
      edges{
        node {
          ${transaction}
        }
      }
      pageInfo {
        startCursorId
        endCursorId
        hasNextPage
      }
    }
  }
`;
export const POST_TOKTOKWALLET_REQUEST_MONEY = gql`
  mutation postToktokWalletRequestMoney($input: PostToktokWalletRequestMoneyInput!) {
    postToktokWalletRequestMoney(input: $input) {
      hash
      status
      data {
        message
        requestTakeMoneyId
        validator
        referenceNumber
      }
    }
  }
`;
export const POST_BILLS_TRANSACTION = gql`
  mutation postBillsTransaction($input: PostTransactionInput!) {
    postBillsTransaction(input: $input) {
      status
      data {
        ${transaction}
      }
    }
  }
`;
export const POST_BILLS_VALIDATE_TRANSACTION = gql`
  mutation postBillsValidateTransaction($input: PostBillsValidateTransactionInput!) {
    postBillsValidateTransaction(input: $input) {
      Status
      Success
      Message
      ReferenceNumber
      Data {
        FirstField
        SecondField
        Amount
        BillerTag
      }
    }
  }
`;

export const POST_BILLS_SSS = gql`
  mutation postBillsSSS($input: PostBillsSSSInput!) {
    postBillsSSS(input: $input) {
      status
      data {
        ${transaction}
      }
    }
  }
`;

export const POST_BILLS_PAGIBIG = gql`
  mutation postBillsPagibig($input: PostBillsPagibigInput!) {
    postBillsPagibig(input: $input) {
      status
      data {
        ${transaction}
      }
    }
  }
`;
