import gql from 'graphql-tag';

const address = `
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
}`;

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

export const PREF_USER_ADDRESS_CREATE = gql`
  mutation prefUserAddressCreate($input: PrefUserAddressCreateInput!) {
    prefUserAddressCreate(input: $input) {
      message
    }
  }
`;

export const PREF_USER_ADDRESS_DELETE = gql`
  mutation prefUserAddressDelete($input: PrefUserAddressDeleteInput!) {
    prefUserAddressDelete(input: $input) {
      message
    }
  }
`;

export const PREF_USER_ADDRESS_UPDATE = gql`
  mutation prefUserAddressUpdate($input: PrefUserAddressUpdateInput!) {
    prefUserAddressUpdate(input: $input) {
      message
    }
  }
`;

export const PREF_GET_SAVED_ADDRESS = gql`
  query prefGetSavedAddress($input: PrefGetSavedAddressInput!) {
    prefGetSavedAddress(input: $input) {
      ${address}
    }
  }
`;

export const PREF_GET_SAVED_ADDRESSES = gql`
  query {
    prefGetSavedAddresses {
      ${address}
    }
  }
`;

export const PREF_GET_SAVED_ADDRESS_DEFAULT = gql`
  query {
    prefGetSavedAddressDefault {
      ${address}
    }
  }
`;
