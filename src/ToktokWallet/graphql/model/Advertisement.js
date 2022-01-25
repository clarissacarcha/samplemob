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
