import gql from 'graphql-tag';

export const GET_ORDER_PRICE = gql`
  mutation getOrderPrice($input: GetOrderPriceInput!) {
    getOrderPrice(input: $input)
  }
`;
