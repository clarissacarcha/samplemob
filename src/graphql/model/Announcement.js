import gql from 'graphql-tag';

export const GET_ANNOUNCEMENTS = gql`
  query getAnnouncements($filter: GetAnnouncementsFilter) {
    getAnnouncements(filter: $filter) {
      id
      title
      body
      thumbnail
      image
      createdAt
    }
  }
`;
