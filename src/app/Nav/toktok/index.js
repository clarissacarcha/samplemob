import React from 'react';

import AnnouncementScreens from './AnnouncementScreens';
import DeliveryCommonScreens from './DeliveryCommonScreens';
import DeliveryOrderScreens from './DeliveryOrderScreens';
import LandingScreens from './LandingBottomTabScreens';
import RootScreens from './RootScreens';
import SavedLocationScreens from './SavedLocationScreens';

export default ({Navigator}) => {
  return (
    <>
      {AnnouncementScreens({Navigator})}
      {DeliveryCommonScreens({Navigator})}
      {DeliveryOrderScreens({Navigator})}
      {LandingScreens({Navigator})}
      {RootScreens({Navigator})}
      {SavedLocationScreens({Navigator})}
    </>
  );
};
