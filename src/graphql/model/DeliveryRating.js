import gql from 'graphql-tag';

export const POST_DRIVER_DELIVERY_RATING = gql`
  mutation postDriverDeliveryRating($input: PostDriverDeliveryRatingInput!) {
    postDriverDeliveryRating(input: $input) {
      rating
      feedback
      createdAt
    }
  }
`;
export const POST_CONSUMER_DELIVERY_RATING = gql`
  mutation postConsumerDeliveryRating($input: PostConsumerDeliveryRatingInput!) {
    postConsumerDeliveryRating(input: $input) {
      rating
      feedback
      createdAt
    }
  }
`;
