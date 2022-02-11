import gql from 'graphql-tag';

const tempCart = `
  totalAmount
  addonsTotalAmount
  totalAmountWithAddons
  items {
    id
    shopid
    branchid
    companyId
    productid
    quantity
    basePrice
    totalAmount
    addonsTotalAmount
    productName
    productLogo
    notes
    shopLatitude
    shopLongitude
    shopCity
    shopRegion
    parentProductId
    parentProductName
    resellerDiscount
    shopName
    addonsDetails {
      id
      optionName
      optionPrice
      status
      optionDetailsId
      optionDetailsName
    }
  }
`;

const voucherType = `
  id
  key
  shopid
  amount
  minimum
  minimum_price
  sf_discount
  valid
  valid_from
  valid_until
  vcode
  vname
  is_percentage
  is_subsidize
  sf_discount
  on_top
  handle_shipping_promo
  code_required
  limit_perCustomer
  payment_method
  percentage_subsidize
  company_id
  region
  requirement
  set_end_date
  no_of_stocks
`;

export const GET_TEMPORARY_CART = gql`
  query getTemporaryCart($input: GetTemporaryCartInput) {
    getTemporaryCart(input: $input) {
      ${tempCart}
    }
  }
`;
export const GET_ALL_TEMPORARY_CART = gql`
  query getAllTemporaryCart($input: GetAllTemporaryCartInput) {
    getAllTemporaryCart(input: $input) {
      ${tempCart}
    }
  }
`;
export const POST_TEMPORARY_CART = gql`
  mutation postTemporaryCart($input: PostTemporaryCartInput) {
    postTemporaryCart(input: $input) {
      status
      message
    }
  }
`;
export const PATCH_TEMPORARY_CART_ITEM = gql`
  mutation patchTemporaryCartItem($input: PatchTemporaryCartItemInput) {
    patchTemporaryCartItem(input: $input) {
      status
      message
    }
  }
`;
export const DELETE_TEMPORARY_CART_ITEM = gql`
  mutation deleteTemporaryCartItem($input: DeleteTemporaryCartItemInput) {
    deleteTemporaryCartItem(input: $input) {
      status
      message
    }
  }
`;
export const DELETE_SHOP_TEMPORARY_CART = gql`
  mutation deleteShopTemporaryCart($input: DeleteShopTemporaryCartInput) {
    deleteShopTemporaryCart(input: $input) {
      status
      message
    }
  }
`;
export const CHECK_HAS_TEMPORARY_CART = gql`
  query checkHasTemporaryCart($input: CheckHasTemporaryCartInput) {
    checkHasTemporaryCart(input: $input) {
      shopid
    }
  }
`;

export const GET_AUTO_SHIPPING = gql`
  query getAutoShipping($input: ShippingInput) {
    getAutoShipping(input: $input) {
      success
      message
      type
      voucher {
        ${voucherType}
      }
    }
  }
`;

export const GET_VOUCHER_CODE = gql`
  query getVoucherCode($input: VoucherInput) {
    getVoucherCode(input: $input) {
      success
      message
      type
      voucher {
        ${voucherType}
      }
    }
  }
`;
