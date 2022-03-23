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
      promos {
        id
        shippingDiscountName
        shippingDiscountCode
        shopId
        noOfStocks
      }
      promoByAdmin {
        id
        shippingDiscountName
        shippingDiscountCode
        shopId
        noOfStocks
      }
      promoByMerchant {
        id
        shippingDiscountName
        shippingDiscountCode
        shopId
        noOfStocks
      }
      promotionVouchers {
        id
        regionCodes
        voucherCode
        voucherName
      }
      hasOpen
      hasProduct
      operatingHours {
        id
        shopId
        fromTime
        toTime
        day
        status
        dayStatus
      }
      nextOperatingHrs {
        id
        shopId
        fromTime
        toTime
        day
        status
        dayStatus
      }
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
      hasProduct
      hasOpen
      nextOperatingHrs {
        id
        shopId
        fromTime
        toTime
        day
        status
        dayStatus
      }
      operatingHours {
        id
        shopId
        fromTime
        toTime
        day
        status
        dayStatus
      }
      dayLapsed
    }
  }
`;

export const GET_SHOP_STATUS = gql`
  query getShopStatus($input: GetShopStatusInput!) {
    getShopStatus(input: $input) {
      shopname
      status
    }
  }
`;

export const GET_SEARCH_FOOD = gql`
  query getSearchFood($input: FoodInput!) {
    getSearchFood(input: $input) {
      id
      ratings
      shopname
      logo
      banner
      address
      estimatedDistance
      estimatedDeliveryTime
      hasOpen
      nextOperatingHrs {
        id
        shopId
        fromTime
        toTime
        day
        status
        dayStatus
      }
      operatingHours {
        id
        shopId
        fromTime
        toTime
        day
        status
        dayStatus
      }
    }
  }
`;
