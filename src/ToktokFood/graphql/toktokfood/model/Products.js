import gql from 'graphql-tag';

const products = `
  Id
  itemid
  catId
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
  variants {
    id
    optionName
    isRequired
    noOfSelection
    status
    options {
      id
      optionName
      optionPrice
      status
      optionDetailsId
    }
  }
`

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
