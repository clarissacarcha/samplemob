import gql from 'graphql-tag';

export const GET_DELIVERIES = gql`
  query getDeliveries($filter: deliveryFilter) {
    getDeliveries(filter: $filter) {
      id
      tokConsumerId
      distance
      duration
      price
      notes
      status
      createdAt
      senderStop {
        name
        mobile
        landmark
        formattedAddress
        latitude
        longitude
        orderType
        scheduledFrom
        scheduledTo
      }
      recipientStop {
        name
        mobile
        landmark
        formattedAddress
        latitude
        longitude
        orderType
        scheduledFrom
        scheduledTo
      }
      logs {
        status
        image
        createdAt
      }
      driver {
        id
        user {
          username
          person {
            firstName
            lastName
          }
        }
      }
    }
  }
`;

export const GET_DELIVERIES_COUNT_BY_STATUS = gql`
  query getDeliveriesCountByStatus($filter: deliveryFilter) {
    getDeliveriesCountByStatus(filter: $filter) {
      status
      count
    }
  }
`;

export const POST_DELIVERY = gql`
  mutation postDelivery($input: PostDeliveryInput) {
    postDelivery(input: $input)
  }
`;

export const PATCH_DELIVERY_ACCEPTED = gql`
  mutation patchDeliveryAccepted($input: PatchDeliveryAcceptedInput!) {
    patchDeliveryAccepted(input: $input)
  }
`;

export const PATCH_DELIVERY_CANCEL = gql`
  mutation patchDeliveryCancel($input: PatchDeliveryCancelInput!) {
    patchDeliveryCancel(input: $input) {
      id
      tokConsumerId
      distance
      duration
      price
      notes
      status
      senderStop {
        name
        mobile
        landmark
        formattedAddress
        latitude
        longitude
        orderType
        scheduledFrom
        scheduledTo
      }
      recipientStop {
        name
        mobile
        landmark
        formattedAddress
        latitude
        longitude
        orderType
        scheduledFrom
        scheduledTo
      }
      logs {
        status
        image
        createdAt
      }
      driver {
        id
        user {
          username
          person {
            firstName
            lastName
          }
        }
      }
    }
  }
`;

export const PATCH_DELIVERY_DELETE = gql`
  mutation patchDeliveryDelete($input: PatchDeliveryDeleteInput!) {
    patchDeliveryDelete(input: $input)
  }
`;

export const PATCH_DELIVERY_REBOOK = gql`
  mutation patchDeliveryRebook($input: PatchDeliveryRebookInput!) {
    patchDeliveryRebook(input: $input)
  }
`;

export const PATCH_DELIVERY_INCREMENT_STATUS = gql`
  mutation patchDeliveryIncrementStatus($input: PatchDeliveryIncrementStatusInput!) {
    patchDeliveryIncrementStatus(input: $input) {
      id
      tokConsumerId
      distance
      duration
      price
      notes
      status
      senderStop {
        name
        mobile
        landmark
        formattedAddress
        latitude
        longitude
        orderType
        scheduledFrom
        scheduledTo
      }
      recipientStop {
        name
        mobile
        landmark
        formattedAddress
        latitude
        longitude
        orderType
        scheduledFrom
        scheduledTo
      }
      logs {
        status
        image
        createdAt
      }
      driver {
        id
        user {
          username
          person {
            firstName
            lastName
          }
        }
      }
    }
  }
`;
