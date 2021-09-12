import gql from 'graphql-tag';

export const GET_SHOPS = gql`
  query getShops($input: ShopInput) {
    getShops(input: $input) {
      id
      address
      shopname
      banner
      logo
      latitude
      longitude
      ratings
      estimatedDistance
      estimatedDeliveryTime
    }
  }
`;

export const RATE_SHOP = gql`
  mutation rateShop($input: ShopRatingInput) {
    rateShop(input: $input) {
      status
      message
    }
  }
`;

export const CHECK_IF_SHOP_WAS_RATED = gql`
  query checkIfShopWasRated($input: CheckIfShopWasRatedInput) {
    checkIfShopWasRated(input: $input) {
      status
    }
  }
`;

