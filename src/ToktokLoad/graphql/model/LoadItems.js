import gql from 'graphql-tag'

export const GET_LOAD_ITEMS = gql`
  query getLoadItems($input: GetLoadItemsInput) {
    getLoadItems(input: $input) {
      id
      name
      amount
      favorite {
        id
        loadItemId
        mobileNumber
      }
    }
  }
`
