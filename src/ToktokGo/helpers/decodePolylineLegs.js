import PolylineUtility from '@mapbox/polyline';
import _ from 'lodash';

export const decodeLegsPolyline = legs => {
  const decodedLegsPolyline = legs.map(leg => {
    return leg.steps.map(step => {
      const decodedStepPolyline = PolylineUtility.decode(step.polyline.points);

      return decodedStepPolyline.map(point => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
    });
  });

  return _.flattenDeep(decodedLegsPolyline);
};
