import gql from 'graphql-tag'

export const GET_BILL_TYPES = gql`
  query {
    getBillTypes {
      id
      name
      icon
    }
  }
`