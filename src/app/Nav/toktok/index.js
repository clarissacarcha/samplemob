import React from 'react';

import AnnouncementScreens from './AnnouncementScreens';
import DeliveryCommonScreens from './DeliveryCommonScreens';
import DeliveryServiceScreens from './DeliveryServiceScreens';
import LandingScreens from './LandingBottomTabScreens';
import RootScreens from './RootScreens';

export default ({Navigator}) => {
  return (
    <>
      {AnnouncementScreens({Navigator})}
      {DeliveryCommonScreens({Navigator})}
      {DeliveryServiceScreens({Navigator})}
      {LandingScreens({Navigator})}
      {RootScreens({Navigator})}
    </>
  );
};
