import gql from 'graphql-tag';

export const GET_ANNOUNCEMENTS = gql`
  query {
    getAnnouncements {
      id
      title
      body
      thumbnail
      image
      createdAt
    }
  }
`;
