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

export const PATCH_GO_REFERRAL_USER_ID = gql`
  mutation patchGoReferralUserId($input: PatchGoReferralUserIdInput!) {
    patchGoReferralUserId(input: $input) {
      message
    }
  }
`;
