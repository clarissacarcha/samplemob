import gql from 'graphql-tag';

export const GET_SHOPS = gql`
  query getShops {
    getShops {
      id
      address
      distance
      shopname
      totalBranches
    }
  }
`;
