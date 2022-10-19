import gql from 'graphql-tag';

export const GET_ANNOUNCEMENTS = gql`
  query getAnnouncements($filter: GetAnnouncementsFilter) {
    getAnnouncements(filter: $filter) {
      id
      header
      title
      body
      thumbnail
      image
      tokAnnouncementServiceId
      announcementService {
        serviceName
        key
        status
        createdAt
      }
      createdAt
    }
  }
`;
