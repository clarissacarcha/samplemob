import gql from 'graphql-tag';

export const GET_PARTNER_BRANCHES = gql`
  query getPartnerBranches($input: GetPartnerBranchesInput!) {
    getPartnerBranches(input: $input) {
      id
      branchName
      branchLogo
      branchCode
      formattedAddress
      latitude
      longitude
    }
  }
`;
