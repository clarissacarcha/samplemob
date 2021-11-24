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
      descriptions
      logo
      firstFieldName
      firstFieldFormat
      firstFieldWidth
      firstFieldWidthType
      secondFieldName
      secondFieldFormat
      secondFieldWidth
      secondFieldWidthType
      commissionRateStatus
      providerId
      billTypeId
      itemDocumentId
      commissionRateDetails {
        id
        referralCommissionItemId
        merchantCommissionRate
        startup
        mcjr
        mcsuper
        jc
        mc
        mcmeg
        others
        providerOnTopValue
        systemOnTopValue
        providerDiscountRate
      }
    }
  }
`
