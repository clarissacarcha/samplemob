const baseDistance = 10.0;
const flatRate = 60.0;
const perKm = 6.0;

export const calculateOrderPrice = ({ distance }: any) => {
  // If distance is below baseDistance, return flat rate
  if (distance < baseDistance) {
    return flatRate;
  }

  // Compute for price, deduct baseDistance from distance to use as final distance
  const finalDistance = distance - baseDistance;

  return Math.ceil(flatRate + finalDistance * perKm);
};
