import gql from 'graphql-tag'

export const GET_BILL_TYPES = gql`
  query {
    getBillTypes {
      id
      name
      icon
    }
  }
`
export const GET_BILL_ITEMS = gql`
  query getBillItems($input: GetBillItemsInput) {
    getBillItems(input: $input) {
      id
      name
      descriptions
      logo
    }
  }
`
export const GET_SEARCH_BILL_ITEMS = gql`
  query getSearchBillItems($input: GetSearchBillItemsInput) {
    getSearchBillItems(input: $input) {
      id
      name
      descriptions
      logo
    }
  }
`
export const GET_BILL_ITEM_SETTINGS = gql`
  query getBillItemSettings($input: GetBillSettingsInput) {
    getBillItemSettings(input: $input) {
      id
      name
      itemCode
      descriptions
      logo
      firstFieldName
      firstFieldFormat
      firstFieldWidth
      firstFieldWidthType
      firstFieldMinWidth
      secondFieldName
      secondFieldFormat
      secondFieldWidth
      secondFieldWidthType
      secondFieldMinWidth
      commissionRateStatus
      providerId
      billTypeId
      itemDocumentId
      referralCommissionItemId
      itemDocumentDetails {
        id
        paymentPolicy1
        paymentPolicy2
        termsAndConditions
      }
      commissionRateDetails {
        id
        ofps
        startup
        mcjr
        mcsuper
        jc
        mc
        mcmeg
        others
        providerComValue
        systemServiceFee
        providerServiceFee
        providerComRate
        comType
      }
    }
  }
`
