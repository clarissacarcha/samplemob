import React from 'react';
import {ToktokAddLocation, ToktokSavedLocations} from 'toktok/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokAddLocation" component={ToktokAddLocation} />
    <Navigator.Screen name="ToktokSavedLocations" component={ToktokSavedLocations} />
  </>
);
