import gql from 'graphql-tag';

export const GET_DELIVERY_CANCELLATION_CATEGORIES = gql`
  query getDeliveryCancellationCategories($filter: GetDeliveryCancellationCategoriesFilter!) {
    getDeliveryCancellationCategories(filter: $filter) {
      id
      name
    }
  }
`;
