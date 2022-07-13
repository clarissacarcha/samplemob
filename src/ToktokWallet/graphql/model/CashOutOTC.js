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
      toktokServiceFee
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

export const POST_FINALIZE_OTC = gql`
  mutation postFinalizeOtc($input: PostFinalizeOtcInput) {
    postFinalizeOtc(input: $input) {
      id
      cashOutId
      emailAddress
      status
      purpose
      requestDate
      settledDate
      validityEndDate
      isClaim
      claimedDate
      cashOut {
        id
        referenceNumber
        amount
        currencyId
        cashOutProviderId
        cashOutBankAccountId
        providerServiceFee
        systemServiceFee
      }
    }
  }
`;
