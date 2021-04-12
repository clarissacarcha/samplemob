import gql from 'graphql-tag';

export const GET_GOOGLE_PLACE_DETAILS = gql`
  query getGooglePlaceDetails($input: GetGooglePlaceDetailsInput!) {
    getGooglePlaceDetails(input: $input) {
      location {
        latitude
        longitude
      }
      addressBreakdownHash
    }
  }
`;
