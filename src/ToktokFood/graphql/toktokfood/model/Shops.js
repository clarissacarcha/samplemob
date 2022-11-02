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
      allowPickup
      promoName
      shopVoucher {
        voucherName
        voucherCode
        validUntil
      }
      promos {
        id
        shippingDiscountName
        shippingDiscountCode
        shopIds
        noOfStocks
      }
      promoByAdmin {
        id
        shippingDiscountName
        shippingDiscountCode
        shopIds
        noOfStocks
      }
      promoByMerchant {
        id
        shippingDiscountName
        shippingDiscountCode
        shopIds
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
      dayLapsed
      orderOnOff
      customerReqOpt
    }
  }
`;

export const GET_SHOPS_W_PROMOTIONS = gql`
  query getPromoSections($input: ShopPromosInput) {
    getPromoSections(input: $input) {
      voucherName
      name
      shopsWithPromo {
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
        allowPickup
        promoName
        shopVoucher {
          voucherName
          voucherCode
          validUntil
        }
        promos {
          id
          shippingDiscountName
          shippingDiscountCode
          shopIds
          noOfStocks
        }
        promoByAdmin {
          id
          shippingDiscountName
          shippingDiscountCode
          shopIds
          noOfStocks
        }
        promoByMerchant {
          id
          shippingDiscountName
          shippingDiscountCode
          shopIds
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
        dayLapsed
        orderOnOff
        customerReqOpt
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
      shopVoucher {
        voucherName
        voucherCode
        validUntil
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
      hasProduct
      shopVoucher {
        voucherName
        voucherCode
        validUntil
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

export const GET_SHOP_BY_CATEGORY = gql`
  query getShopByCategory($input: ShopCategoryInput!) {
    getShopByCategory(input: $input) {
      id
      ratings
      shopname
      logo
      banner
      address
      estimatedDistance
      estimatedDeliveryTime
      hasOpen
      hasProduct
      shopVoucher {
        voucherName
        voucherCode
        validUntil
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

export const GET_SHOP_BANNERS = gql`
  query getShopBanners {
    getShopBanners {
      id
      filename
      status
    }
  }
`;
