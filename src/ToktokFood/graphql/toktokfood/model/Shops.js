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
      promoName
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
export const CHECK_SHOP_VALIDATIONS = gql`
  query checkShopValidations($input: CheckShopValidationsInput) {
    checkShopValidations(input: $input) {
      allowPickup
      isOpen
    }
  }
`;
export const GET_SHOP_DETAILS = gql`
  query getShopDetails($input: GetShopDetailsInput) {
    getShopDetails(input: $input) {
      id
      address
      shopname
      shopRegion
      shopCity
      banner
      logo
      latitude
      longitude
      ratings
      estimatedDistance
      estimatedDeliveryTime
      isOpen
      allowPickup
      email
      mobile
    }
  }
`;
