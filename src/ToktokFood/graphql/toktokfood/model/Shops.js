import gql from 'graphql-tag';

export const GET_SHOPS = gql`
  query getShops($input: ShopInput) {
    getShops(input: $input) {
      id
      address
      shopname
      banner
      logo
      ratings
      estimatedDistance
      estimatedDeliveryTime
    }
  }
`;
