import gql from 'graphql-tag';

export const GET_PLACE_AUTOCOMPLETE = gql`
  query getPlaceAutocomplete($input: getPlaceAutocompleteInput) {
    getPlaceAutocomplete(input: $input) {
      formattedAddress
      placeId
    }
  }
`;
