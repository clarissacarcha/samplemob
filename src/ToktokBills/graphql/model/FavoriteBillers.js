import gql from 'graphql-tag';

const favoriteBills = `
  edges {
    node {
      id
      billItemId
      billItem {
        id
        name
        descriptions
        logo
        firstFieldName
        secondFieldName
        billType {
          name
        }
      }
      firstFieldValue
      secondFieldValue
    }
  }
  pageInfo {
    startCursorId
    endCursorId
    startCursorUpdatedAt
    endCursorUpdatedAt
    hasNextPage
  }
`;

export const GET_FAVORITE_BILLS = gql`
  query {
    getFavoriteBills {
      id
      billItemId
      billItem {
        descriptions
        logo
        billType {
          name
        }
      }
      firstFieldValue
      secondFieldValue
    }
  }
`;

export const GET_FAVORITES_BILLS_ITEMS = gql`
  query getFavoriteBillsPaginate($input: GetFavoriteBillsPaginateInput) {
    getFavoriteBillsPaginate(input: $input) {
      ${favoriteBills}
    }
  }
`;

export const GET_SEARCH_FAVORITE_BILLS = gql`
  query getSearchFavoriteBillsPaginate($input: GetSearchFavoriteBillsPaginateInput) {
    getSearchFavoriteBillsPaginate(input: $input) {
      ${favoriteBills}
    }
  }
`;

export const PATCH_REMOVE_FAVORITE_BILL = gql`
  mutation patchRemoveFavoriteBill($input: PatchRemoveFavoriteBillInput) {
    patchRemoveFavoriteBill(input: $input) {
      message
    }
  }
`;

export const POST_FAVORITE_BILL = gql`
  mutation postFavoriteBill($input: PostFavoriteBillInput) {
    postFavoriteBill(input: $input) {
      favoriteBill {
        id
      }
      message
    }
  }
`;

export const POST_CHECK_IF_FAVORITE_EXIST = gql`
  mutation postCheckIfFavoriteExist($input: PostCheckIfFavoriteExistInput) {
    postCheckIfFavoriteExist(input: $input) {
      result
      message
    }
  }
`;
