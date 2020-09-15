import gql from 'graphql-tag';

export const GET_APP_VERSION_STATUS = gql`
  query getAppVersionStatus($filter: GetAppVersionStatusFilter!) {
    getAppVersionStatus(filter: $filter) {
      isCurrent
      enabled
    }
  }
`;
