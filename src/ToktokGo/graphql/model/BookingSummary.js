import gql from 'graphql-tag';

export const GET_QUOTATION = gql`
  query getQuotation($input: GetQuotationInput!) {
    getQuotation(input: $input) {
      route {
        distance {
          kilometer
        }
        duration {
          minute
        }
        bounds {
          northeast {
            latitude
            longitude
          }
          southwest {
            latitude
            longitude
          }
        }
        legs {
          steps {
            polyline {
              points
            }
          }
        }
      }
      vehicleTypeRates {
        vehicleType {
          id
          name
          phrase
        }
        rate {
          amount
          flatRate
          mileageFee
        }
      }
    }
  }
`;
