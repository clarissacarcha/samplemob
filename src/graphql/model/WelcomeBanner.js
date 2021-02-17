import gql from 'graphql-tag';

export const GET_WELCOME_BANNER = gql`
  query getWelcomeBanner($filter: GetWelcomeBannerFilter!) {
    getWelcomeBanner(filter: $filter) {
      title
      message
      image
      created
    }
  }
`;
