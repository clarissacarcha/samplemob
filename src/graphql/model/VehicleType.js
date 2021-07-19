import gql from 'graphql-tag';

export const GET_VEHICLE_TYPES = gql`
  query {
    getVehicleTypes {
      id
      type
      name
      phrase
      flatRate
      perKm
      threshold
      cargoWeightCapacity
      status
    }
  }
`;
