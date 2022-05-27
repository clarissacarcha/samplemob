import gql from 'graphql-tag';

export const GET_FAVORITE_BILLS = gql`
  query {
    getFavoriteBills {
      id
      billItemId
      firstFieldValue
      secondFieldValue
      billItem {
        id
        logo
        descriptions
        billTypeId
      }
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
