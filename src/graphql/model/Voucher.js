import gql from 'graphql-tag';

const TokwaVoucher = `
hash
id
name
code
description
policies
category
status
createdAt
tokwaVoucher {
  id
  tokwaExchangeCost
  tokwaExchangeValue
  image
  createdAt
  voucherId
}
promoVoucher {
  id
  discountType
  discountValue
  useCost
  collectable
  collectCost
  collectCount
  dailyLimit
  lifetimeLimit
  dailyMaxCount
  lifetimeMaxCount
  totalCollected
  totalUsed
  isCash
  isCod
  isTokwa
  startAt
  endAt
  createdAt
  voucherId
}
voucherWallet {
  id
  remaining
  total
  status
  createdAt
  voucherId
  toktokUserId
  voucherTransactionId
}
`;

export const GET_VOUCHERS = gql`
  query getVouchers($input: GetVouchersInput!) {
    getVouchers(input: $input) {
      ${TokwaVoucher}
    }
  }
`;

export const GET_SEARCH_VOUCHER = gql`
  query getSearchVoucher($input: GetSearchVoucherInput) {
    getSearchVoucher(input: $input) {
      ${TokwaVoucher}
    }
  }
`;

export const GET_VOUCHER = gql`
  query getVoucher($input: GetVoucherInput) {
    getVoucher(input: $input) {
      ${TokwaVoucher}
    }
  }
`;

export const POST_COLLECT_VOUCHER = gql`
  mutation postCollectVoucher($input: PostCollectVoucherInput) {
    postCollectVoucher(input: $input) {
      id
      remaining
      total
      status
      createdAt
      voucherId
      toktokUserId
      voucherTransactionId
    }
  }
`;
