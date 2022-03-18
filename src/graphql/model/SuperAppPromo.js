import gql from 'graphql-tag';

export const GET_SUPER_APP_PROMOS = gql`
  query {
    getSuperAppPromos {
      id
      name
      banner
      title
      header
      body
      footer
      startAt
      endAt
      status
    }
  }
`;
