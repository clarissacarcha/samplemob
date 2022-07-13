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

export const POST_INITIALIZE_OTC = gql`
  mutation postInitializeOtc($input: PostInitializeOtcInput) {
    postInitializeOtc(input: $input) {
      validator
      message
    }
  }
`;

export const GET_CASH_OUT_OTC = gql`
  query getCashOutOtc($input: GetCashOutOtcInput!) {
    getCashOutOtc(input: $input) {
      edges {
        node {
          id
          cashOutId
          cashOut {
            id
            referenceNumber
            amount
            isExported
            status
            accountId
            currencyId
            cashOutProviderId
            cashOutBankAccountId
          }
          cashOutProviderPartnerId
          cashOutProviderPartner {
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
            createdAt
            updatedAt
            toktokServiceFee
          }
          status
          statusCode
          providerReferenceNumber
          requestDate
          settledDate
          validityEndDate
          isClaim
          claimedDate
          purpose
          emailAddress
          createdAt
          updatedAt
        }
      }
      pageInfo {
        startCursorId
        endCursorId
        hasNextPage
      }
    }
  }
`;
