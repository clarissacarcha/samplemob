import gql from 'graphql-tag';

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
      Id
      itemid
      catId
      itemname
      price
      noOfStocks
      maxQty
      enabled
      otherinfo
      tags
      summary
      filename
    }
  }
`;
