import React from 'react';
import {ToktokAddLocation, ToktokSavedLocations, LocationAccess} from 'toktok/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokAddLocation" component={ToktokAddLocation} />
    <Navigator.Screen name="ToktokSavedLocations" component={ToktokSavedLocations} />
    <Navigator.Screen name="LocationAccess" component={LocationAccess} options={{headerShown: false}} />
  </>
);
