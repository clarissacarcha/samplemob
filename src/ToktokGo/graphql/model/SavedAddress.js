import gql from 'graphql-tag';

export const GET_SAVED_ADDRESS = gql`
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
