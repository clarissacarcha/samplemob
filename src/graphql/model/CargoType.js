import gql from 'graphql-tag';

export const GET_CARGO_TYPES = gql`
  query {
    getCargoTypes {
      type
      icon
    }
  }
`;
