import gql from 'graphql-tag';

export const GET_CASH_OUT_PROVIDER_PARTNERS = gql`
  query {
    getCashOutProviderPartners {
      id
      procId
      email
      mobileNumber
      name
      description
      logo
      cashOutProvider
      maximumAmount
      type
      status
      validity
      cashOutProviderFee {
        id
        cashOutProviderPartnerId
        amountFrom
        amountTo
        percentageFee
        amountFee
        status
      }
    }
  }
`;
