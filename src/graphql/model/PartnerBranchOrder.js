import gql from 'graphql-tag';

export const GET_PARTNER_BRANCH_ORDERS = gql`
  query getPartnerBranchOrders($input: GetPartnerBranchOrdersInput!) {
    getPartnerBranchOrders(input: $input) {
      id
      price
      cargo {
        type
        tenants {
          id
          name
        }
      }
    }
  }
`;
