import gql from 'graphql-tag';

export const GET_ADVERTISEMENTS = gql`
  query {
    getAdvertisements {
      id
      title
      description
      squareImage
      rectangleImage
      startDuration
      endDuration
      isHighlighted
      isPaid
    }
  }
`;

export const GET_ADVERTISEMENT_CATEGORIES = gql`
  query {
    getAdvertisementCategories {
      id
      categoryType
      description
      bannerType
      status
      advertisement {
        id
        title
        description
        squareImage
        rectangleImage
        startDuration
        endDuration
        isHighlighted
        isPaid
      }
    }
  }
`
