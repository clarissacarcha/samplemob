import gql from 'graphql-tag'

const loadDetails = `
  id
  name
  networkId
  status
  isActive
`
export const GET_LOAD_VARIANTS = gql`
  query getLoadVariants($input: LoadVariantInput) {
    getLoadVariants(input: $input) {
      ${loadDetails}
    }
  }
`
