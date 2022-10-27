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

export const DELETE_SAVED_LOCATION = gql`
  mutation deleteSavedLocation($input: DeleteSavedLocationInput!) {
    deleteSavedLocation(input: $input)
  }
`;

export const GET_ADDRESSES = gql`
  query {
    getAddresses {
      id
      isHome
      isOffice
      label
      isDefault
      landmark
      placeHash
      place {
        location {
          latitude
          longitude
        }
        formattedAddress
        addressBreakdown {
          city
          province
          region
          country
          postal
        }
      }
      contactDetails {
        fullname
        mobile_no
      }
    }
  }
`;

export const POST_NEW_ADDRESS = gql`
  mutation postNewAddress($input: PostAddressInput!) {
    postNewAddress(input: $input) {
      message
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation deleteAddress($input: DeleteAddressInput!) {
    deleteAddress(input: $input) {
      message
    }
  }
`;

export const GET_ADDRESS = gql`
  query getAddress($input: getAddressInput!) {
    getAddress(input: $input) {
      id
      isHome
      isOffice
      isDefault
      label
      landmark
      placeHash
      place {
        location {
          latitude
          longitude
        }
        formattedAddress
        addressBreakdown {
          city
          province
          region
          country
          postal
        }
      }
      contactDetails {
        fullname
        mobile_no
      }
    }
  }
`;

export const PATCH_ADDRESS_CHANGES = gql`
  mutation patchAddressChanges($input: PatchAddressChangesInput!) {
    patchAddressChanges(input: $input) {
      message
    }
  }
`;
