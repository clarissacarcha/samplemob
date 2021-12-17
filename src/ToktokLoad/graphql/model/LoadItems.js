import gql from 'graphql-tag'

export const GET_LOAD_ITEMS = gql`
  query getLoadItems($input: GetLoadItemsInput) {
    getLoadItems(input: $input) {
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
    }
  }
`
