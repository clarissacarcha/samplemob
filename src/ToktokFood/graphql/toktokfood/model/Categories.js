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
