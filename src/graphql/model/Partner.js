import gql from 'graphql-tag';

export const GET_PARTNERS = gql`
  query {
    getPartners {
      id
      partnerName
      partnerCode
      partnerImage
      status
    }
  }
`;
