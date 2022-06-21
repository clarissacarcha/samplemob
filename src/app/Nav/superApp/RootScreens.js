import React from 'react';

import {SuperAppPromosScreen, ReferralScreen} from '../../../SuperApp/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="SuperAppPromos" component={SuperAppPromosScreen} options={{headerShown: false}} />
    <Navigator.Screen name="ReferralScreen" component={ReferralScreen} options={{headerShown: false}} />
  </>
);
