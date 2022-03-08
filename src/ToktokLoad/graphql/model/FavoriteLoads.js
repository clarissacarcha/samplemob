import gql from 'graphql-tag'

export const GET_FAVORITE_LOADS = gql`
  query getFavoriteLoads($input: GetFavoriteLoadsInput!){
    getFavoriteLoads(input: $input) {
      id
      name
      amount
      itemCode
      descriptions
      comRateId
      termsAndConditions
      providerId
      networkId
      planCode
      referralCommissionItemId
      networkDetails {
        id
        name
        comRateId
      }
      favorite {
        id
        loadItemId
      }
      commissionRateDetails {
        id
        ofps
        startup
        mcjr
        mcsuper
        jc
        mc
        mcmeg
        others
        providerComValue
        systemServiceFee
        providerServiceFee
        providerComRate
        comType
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
export const GET_CHECK_FAVORITE_LOAD = gql`
  query getCheckFavoriteLoad($input: GetCheckFavoriteLoadInput!) {
    getCheckFavoriteLoad(input: $input) {
      title
      message
    }
  }
`
