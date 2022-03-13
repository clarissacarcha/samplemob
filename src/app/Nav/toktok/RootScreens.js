import React from 'react';
import {ToktokProfile, ToktokSearch, OnlineFranchiseeLogin} from 'toktok/screens';
import ToktokfoodMerchantComingSoon from '../../../screens/AuthenticatedStack/ConsumerScreens/ToktokfoodMerchantComingSoon';
import ToktokgoComingSoon from '../../../screens/AuthenticatedStack/ConsumerScreens/ToktokgoComingSoon';

const fadeCardStyle = ({current}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const fadeOptions = {headerShown: false, cardStyleInterpolator: fadeCardStyle};

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokSearch" component={ToktokSearch} options={fadeOptions} />
    <Navigator.Screen name="ToktokProfile" component={ToktokProfile} />
    <Navigator.Screen name="OnlineFranchiseeLogin" component={OnlineFranchiseeLogin} />
    <Navigator.Screen
      name="ToktokfoodMerchantComingSoon"
      component={ToktokfoodMerchantComingSoon}
      options={{headerShown: false}}
    />
    <Navigator.Screen name="ToktokgoComingSoon" component={ToktokgoComingSoon} options={{headerShown: false}} />
  </>
);
