import gql from 'graphql-tag';

export const GET_PAGIBIG_PAYMENT_TYPES = gql`
  query {
    getPagibigPaymentTypes {
      id
      code
      description
      minAmount
    }
  }
`;
