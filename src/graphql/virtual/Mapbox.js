import gql from 'graphql-tag';

export const GET_MAPBOX_AUTOCOMPLETE = gql`
  query getMapboxAutocomplete($input: GetMapboxAutocompleteInput!) {
    getMapboxAutocomplete(input: $input) {
      payload {
        success
      }
      suggestions {
        formattedAddress
        geometry {
          location {
            lat
            lng
          }
        }
      }
    }
  }
`;
