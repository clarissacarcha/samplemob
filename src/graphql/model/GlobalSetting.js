import gql from 'graphql-tag';

export const GET_GLOBAL_SETTINGS = gql`
  query {
    getGlobalSettings {
      key
      keyValue
    }
  }
`;
