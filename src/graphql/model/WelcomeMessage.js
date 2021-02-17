import gql from 'graphql-tag';

export const GET_WELCOME_MESSAGE = gql`
  query {
    getWelcomeMessage {
      title
      body
      image
      createdAt
    }
  }
`;
