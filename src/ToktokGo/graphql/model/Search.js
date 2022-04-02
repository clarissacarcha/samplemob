import gql from 'graphql-tag';

export const GET_PLACE_AUTOCOMPLETE = gql`
  query getPlaceAutocomplete($input: GetPlaceAutocompleteInput!) {
    getPlaceAutocomplete(input: $input) {
      formattedAddress
      placeId
    }
  }
`;
export const GET_PLACE_BY_LOCATION = gql`
  query getPlaceByLocation($input: GetPlaceByLocationInput) {
    getPlaceByLocation(input: $input) {
      hash
      place {
        formattedAddress
        location {
          latitude
          longitude
        }
        addressBreakdown {
          city
          province
          region
          country
          postal
        }
      }
    }
  }
`;
