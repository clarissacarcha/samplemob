import gql from 'graphql-tag';

export const GET_ADVERTISEMENTS = gql`
  query getAdvertisements($input: getAdvertisementsInput) {
    getAdvertisements(input: $input) {
      id
      title
      description
      type
      postingStartDate
      postingEndDate
      filename
      displayOrder
    }
  }
`;
