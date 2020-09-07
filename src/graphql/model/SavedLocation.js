import gql from 'graphql-tag';

export const GET_SAVED_LOCATIONS = gql`
  query getSavedLocations($filter: GetSavedLocationsFilter!) {
    getSavedLocations(filter: $filter) {
      id
      name
      latitude
      longitude
      formattedAddress
      createdAt
      updatedAt
      tokConsumerId
    }
  }
`;

export const POST_SAVED_LOCATION = gql`
  mutation postSavedLocation($input: PostSavedLocationInput!) {
    postSavedLocation(input: $input) {
      id
      name
      latitude
      longitude
      formattedAddress
      createdAt
      updatedAt
      tokConsumerId
    }
  }
`;
