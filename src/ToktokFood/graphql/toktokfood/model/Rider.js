import gql from 'graphql-tag';

export const GET_RIDER = gql`
  query getRider($input: GetRiderInput) {
    getRider(input: $input) {
      id
      appSalesOrderId
      riderName
      riderConno
      riderPlatenum
      status
    }
  }
`;
