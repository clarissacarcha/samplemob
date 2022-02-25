import gql from 'graphql-tag'

export const GET_NETWORKS = gql`
  query {
    getNetworks {
      id
      name
      status
      createdAt
      updatedAt
      comRateId
    }
  }
`
