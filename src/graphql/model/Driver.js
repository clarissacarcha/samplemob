import gql from 'graphql-tag';

export const PATCH_DRIVER_GO_ONLINE = gql`
  mutation patchDriverGoOnline($input: PatchDriverGoOnlineOfflineInput!) {
    patchDriverGoOnline(input: $input)
  }
`;

export const PATCH_DRIVER_GO_OFFLINE = gql`
  mutation patchDriverGoOffline($input: PatchDriverGoOnlineOfflineInput!) {
    patchDriverGoOffline(input: $input)
  }
`;
