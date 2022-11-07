import gql from 'graphql-tag';

export const GET_SSS_MEMBERSHIP_TYPES = gql`
  query {
    getSSSMembershipTypes {
      id
      code
      description
    }
  }
`;
