import gql from 'graphql-tag';

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
