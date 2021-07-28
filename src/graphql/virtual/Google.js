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
  query {
    getGooglePlaceSearchNearby(input: {coordinates: {latitude: 14.5601447, longitude: 120.9931885}}) {
      name
      formattedAddress
      location {
        lat
        lng
      }
      placeId
      types
    }
  }
`;
