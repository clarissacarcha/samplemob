import gql from 'graphql-tag';

const tempCart = `
  totalAmount
  items {
    id
    shopid
    branchid
    productid
    quantity
    basePrice
    totalAmount
    productName
    productLogo
    notes
    shopLatitude
    shopLongitude
    addonsDetails {
      id
      optionName
      optionPrice
      status
      optionDetailsId
      optionDetailsName
    }
  }
`
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

