import gql from 'graphql-tag';

export const POST_FRANCHISEE_VERIFICATION = gql`
  mutation postFranchiseeVerification($input: PostFranchiseeVerificationInput!) {
    postFranchiseeVerification(input: $input) {
      message
      consumer {
        referralName
        referralCode
        franchiseeCode
        franchiseeFirstName
        franchiseeLastName
        franchiseeAccountType
      }
    }
  }
`;
