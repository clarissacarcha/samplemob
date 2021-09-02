import gql from 'graphql-tag';

export const GET_CATEGORIES = gql`
  query getCategories($input: CategoryInput) {
    getCategories(input: $input) {
      id
      categoryName
      categoryCode
    }
  }
`;

export const GET_CATEGORIES_BY_PRODUCT = gql`
  query getCategoriesByProduct($input: GetCategoriesByProductInput) {
    getCategoriesByProduct(input: $input) {
      id
      categoryName
      categoryCode
    }
  }
`;

export const GET_CATEGORIES_BY_LIMIT = gql`
  query getCategoriesByLimit($input: GetCategoriesByLimitInput) {
    getCategoriesByLimit(input: $input) {
      id
      categoryName
      categoryCode
    }
  }
`;
