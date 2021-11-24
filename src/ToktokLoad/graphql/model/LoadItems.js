import gql from 'graphql-tag'

export const GET_LOAD_ITEMS = gql`
  query getLoadItems($input: GetLoadItemsInput) {
    getLoadItems(input: $input) {
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
      favorite {
        id
        loadItemId
        mobileNumber
      }
    }
  }
`
