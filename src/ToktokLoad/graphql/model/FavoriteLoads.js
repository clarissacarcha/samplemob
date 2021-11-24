import gql from 'graphql-tag'

export const GET_FAVORITE_LOADS = gql`
  query {
    getFavoriteLoads {
      id
      loadItemId
      mobileNumber
      loadDetails {
        id
        name
        amount
        comRateId
        termsAndConditions
        providerId
        networkId
        networkDetails {
          id
          name
          comRateId
        }
      }
    }
  } 
`
export const POST_FAVORITE_LOAD = gql`
  mutation postFavoriteLoad($input: FavoriteLoadInput) {
    postFavoriteLoad(input: $input) {
      status
      message
    }
  }
`
export const PATCH_REMOVE_FAVORITE_LOAD = gql`
  mutation patchRemoveFavoriteLoad($input: FavoriteLoadInput) {
    patchRemoveFavoriteLoad(input: $input) {
      status
      message
    }
  }
`
