import gql from 'graphql-tag';

export const POST_VERIFY_IF_PEP = gql`
  mutation postVerifyIfPep($input: PostVerifyIfPepInput) {
    postVerifyIfPep(input: $input)
  }
`;
