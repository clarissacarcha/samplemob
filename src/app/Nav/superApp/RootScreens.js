import React from 'react';

import {SuperAppPromosScreen, ReferralScreen, VoucherScreen} from '../../../SuperApp/screens';
import {SelectedVoucherScreen} from '../../../SuperApp/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="SuperAppPromos" component={SuperAppPromosScreen} options={{headerShown: false}} />
    <Navigator.Screen name="ReferralScreen" component={ReferralScreen} options={{headerShown: false}} />
    <Navigator.Screen name="VoucherScreen" component={VoucherScreen} options={{headerShown: false}} />
    <Navigator.Screen name="SelectedVoucherScreen" component={SelectedVoucherScreen} options={{headerShown: false}} />
  </>
);
