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
        itemname
        price
        noOfStocks
        maxQty
        enabled
        otherinfo
        tags
        summary
        img_1
        img_2
        img_3
        img_4
        img_5
    }
  }
`;
