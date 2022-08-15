import React from 'react';

import SuperAppPromosScreen from '../../../SuperApp/screens/SuperAppPromos/SuperAppPromos';
import {SelectedVoucherScreen, VoucherScreen} from '../../../SuperApp/screens';
import ReferralScreen from '../../../SuperApp/screens/ReferralScreen/ReferralScreen';
import ReferralExistScreen from '../../../SuperApp/screens/ReferralScreen/ReferralExistScreen';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="SuperAppPromos" component={SuperAppPromosScreen} options={{headerShown: false}} />
    <Navigator.Screen name="ReferralScreen" component={ReferralScreen} options={{headerShown: false}} />
    <Navigator.Screen name="VoucherScreen" component={VoucherScreen} options={{headerShown: false}} />
    <Navigator.Screen name="SelectedVoucherScreen" component={SelectedVoucherScreen} options={{headerShown: false}} />
    <Navigator.Screen name="ReferralExistScreen" component={ReferralExistScreen} options={{headerShown: false}} />
  </>
);
