import gql from 'graphql-tag';

const bankDetails = `
  edges {
    node {
      id
      name
      image
      isHighlight
    }
  }
  pageInfo {
    startCursorId
    endCursorId
    startCursorName
    endCursorName
    hasNextPage
  }
`;
export const GET_HIGHLIGHTED_BANKS = gql`
  query {
    getHighlightedBanks {
      id
      name
      image
      isHighlight
    }
  }
`;
export const GET_BANKS_PAGINATE = gql`
  query getBanksPaginate($input: GetBanksPaginateInput) {
    getBanksPaginate(input: $input) {
      ${bankDetails}
    }
  }
`;

export const GET_SEARCH_BANKS_PAGINATE = gql`
  query getSearchBanksPaginate($input: GetSearchBanksPaginateInput) {
    getSearchBanksPaginate(input: $input) {
      ${bankDetails}
    }
  }
`;

export const GET_BANK_ACCOUNTS_PAGINATE = gql`
  query getBankAccountsPaginate($input: GetBankAccountsPaginateInput) {
    getBankAccountsPaginate(input: $input) {
      edges {
        node {
          id
          accountName
          accountNumber
          nickName
          address
          type
          accountId
          cashOutBankId
          bank {
            id
            name
            image
            isHighlight
          }
        }
      }
      pageInfo {
        startCursorId
        endCursorId
        startCursorName
        endCursorName
        hasNextPage
      }
    }
  }
`;
