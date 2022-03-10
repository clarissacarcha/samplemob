import gql from 'graphql-tag';

const products = `
  Id
  contSellingIsset
  itemid
  catId
  itemname
  basePrice
  price
  stocks
  maxQty
  enabled
  otherinfo
  tags
  summary
  filename
  sysShop
  maxQtyIsset
  productImages  {
    filename
  }
  resellerDiscount {
    discRatetype
    referralDiscount
    referralShopRate
  }
  options {
    id
    optionName
    isRequired
    noOfSelection
    status
    optionLogs {
      id
      optionName
      optionPrice
      status
      optionDetailsId
    }
  }
  variants {
    Id
    itemid
    catId
    contSellingIsset
    itemname
    price
    stocks
    maxQty
    enabled
    otherinfo
    tags
    summary
    filename
    sysShop
    maxQtyIsset
  }
  promotionVouchers {
    id
    voucherCode
    voucherName
    vname
  }
`;

export const GET_PRODUCT_CATEGORIES = gql`
  query getProductCategories($input: GetProductCategoriesInput) {
    getProductCategories(input: $input) {
      id
      categoryName
    }
  }
`;

export const GET_PRODUCTS_BY_SHOP_CATEGORY = gql`
  query getProductsByShopCategory($input: GetProductByShopCategoryInput) {
    getProductsByShopCategory(input: $input) {
      ${products}
    }
  }
`;

export const GET_PRODUCTS_BY_SHOP = gql`
  query getProductsByShop($input: GetProductsByShopInput) {
    getProductsByShop(input: $input) {
      ${products}
    }
  }
`;

export const GET_PRODUCT_DETAILS = gql`
  query getProductDetails($input: GetProductDetailsInput) {
    getProductDetails(input: $input) {
      ${products}
    }
  }
`;
export const GET_SEARCH_PRODUCTS_BY_SHOP = gql`
  query getSearchProductsByShop($input: GetSearchProductByShopInput) {
    getSearchProductsByShop(input: $input) {
      ${products}
    }
  }
`;
