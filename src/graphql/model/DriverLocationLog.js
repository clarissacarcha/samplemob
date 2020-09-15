import gql from 'graphql-tag';

export const POST_DRIVER_LOCATION_LOG = gql`
  mutation postDriverLocationLog($input: PostDriverLocationLogInput) {
    postDriverLocationLog(input: $input)
  }
`;
