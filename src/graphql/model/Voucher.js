import gql from 'graphql-tag';

export const GET_VOUCHERS = gql`
  query getVouchers($input: GetVouchersInput!) {
    getVouchers(input: $input) {
      hash
      id
      name
      code
      description
      policies
      category
      status
      createdAt
      updatedAt
      tokwaVoucher {
        id
        tokwaExchangeCost
        tokwaExchangeValue
        image
        createdAt
        updatedAt
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
        totalCollectable
        totalUsed
        totalCount
        isCash
        isCod
        isTokwa
        startAt
        endAt
        createdAt
        updatedAt
        voucherId
      }
      voucherWallet {
        id
        remaining
        total
        status
        createdAt
        updatedAt
        voucherId
        toktokUserId
        voucherTransactionId
      }
    }
  }
`;
