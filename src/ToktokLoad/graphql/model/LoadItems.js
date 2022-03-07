import gql from 'graphql-tag'

const loadDetails = `
  id
  name
  amount
  descriptions
  comRateId
  termsAndConditions
  providerId
  networkId
  itemCode
  referralCommissionItemId
  planCode
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
`
export const GET_LOAD_ITEMS = gql`
  query getLoadItems($input: GetLoadItemsInput) {
    getLoadItems(input: $input) {
      ${loadDetails}
    }
  }
`
export const GET_SEARCH_LOAD_ITEMS = gql`
  query getSearchLoadItems($input: GetSearchLoadItemsInput) {
    getSearchLoadItems(input: $input) {
      ${loadDetails}
    }
  }
`

