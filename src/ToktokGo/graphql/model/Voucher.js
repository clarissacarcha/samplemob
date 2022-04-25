import gql from 'graphql-tag';

export const GET_VOUCHERS = gql`
  query getVouchers {
    getVouchers {
      id
      name
      code
      startAt
      endAt
      hash
    }
  }
`;
