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

export const GET_GOOGLE_GEOCODE_REVERSE = gql`
  query getGoogleGeocodeReverse($input: GetGoogleGeocodeReverseInput!) {
    getGoogleGeocodeReverse(input: $input) {
      formattedAddress
      addressBreakdown {
        city
        province
        region
      }
      addressBreakdownHash
    }
  }
`;

export const GET_GOOGLE_PLACE_SEARCH_NEARBY = gql`
  query getGooglePlaceSearchNearby($input: GetGooglePlaceSearchNearbyInput!) {
    getGooglePlaceSearchNearby(input: $input) {
      name
      formattedAddress
      placeId
      location {
        lat
        lng
      }
      types
    }
  }
`;
