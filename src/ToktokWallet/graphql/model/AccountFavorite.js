import gql from 'graphql-tag';

export const GET_FAVORITES = gql`
  query {
    getFavorites {
      id
      accountId
      status
      favoriteAccount {
        id
        mobileNumber
        person {
          firstName
          lastName
          selfieImage
        }
      }
    }
  }
`;

export const GET_FAVORITES_PAGINATE = gql`
  query getFavoritesPaginate($input: GetFavoritesPaginateInput) {
    getFavoritesPaginate(input: $input) {
      edges {
        node {
          id
          accountId
          favoriteAccount {
            id
            mobileNumber
            person {
              firstName
              lastName
              selfieImage
            }
          }
        }
      }
      pageInfo {
        startCursorId
        endCursorId
        startCursorUpdatedAt
        endCursorUpdatedAt
        hasNextPage
      }
    }
  }
`;

export const GET_SEARCH_FAVORITES = gql`
  query getSearchFavorites($input: GetSearchFavoritesInput) {
    getSearchFavorites(input: $input) {
      edges {
        node {
          id
          accountId
          favoriteAccount {
            id
            mobileNumber
            person {
              firstName
              lastName
              selfieImage
            }
          }
        }
      }
      pageInfo {
        startCursorId
        endCursorId
        startCursorUpdatedAt
        endCursorUpdatedAt
        hasNextPage
      }
    }
  }
`;

export const POST_FAVORITE_ACCOUNT = gql`
  mutation postFavoriteAccount($input: PostFavoriteAccountInput) {
    postFavoriteAccount(input: $input) {
      id
    }
  }
`;

export const PATCH_REMOVE_FAVORITE = gql`
  mutation patchRemoveFavorite($input: PatchRemoveFavoriteInput) {
    patchRemoveFavorite(input: $input)
  }
`;
