import gql from 'graphql-tag';

export const GET_PAYMENT_CHART = gql`
  query {
    getPaymentChartList {
      id
      name
      description
      paymentChart {
        id
        serviceId
        partnerTypeId
        partnerName
        partnerType {
          id
          name
        }
        paymentChartRanges {
          id
          paymentChartId
          from
          to
          fee
          toktokServiceFee
          rate
        }
      }
    }
  }
`;
