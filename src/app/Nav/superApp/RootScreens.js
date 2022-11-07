import React from 'react';

import SuperAppPromosScreen from '../../../SuperApp/screens/SuperAppPromos/SuperAppPromos';
import {SelectedVoucherScreen, VoucherScreen} from '../../../SuperApp/screens';
import ReferralScreen from '../../../SuperApp/screens/ReferralScreen/ReferralScreen';
import ReferralExistScreen from '../../../SuperApp/screens/ReferralScreen/ReferralExistScreen';
import ToktokPinLocation from '../../../SuperApp/screens/SaveLocationScreens/ToktokPinLocation';
import {ToktokAddEditLocation, ToktokSavedLocations, ToktokLocationAccess} from '../../../SuperApp/screens';
import {ContactsScreen} from '../../../SuperApp/screens/ContactsScreen';
import SuperAppServiceMaintenance from '../../../SuperApp/screens/SuperAppServiceMaintenance';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="SuperAppPromos" component={SuperAppPromosScreen} options={{headerShown: false}} />
    <Navigator.Screen name="ReferralScreen" component={ReferralScreen} options={{headerShown: false}} />
    <Navigator.Screen name="VoucherScreen" component={VoucherScreen} options={{headerShown: false}} />
    <Navigator.Screen name="SelectedVoucherScreen" component={SelectedVoucherScreen} options={{headerShown: false}} />
    <Navigator.Screen name="ReferralExistScreen" component={ReferralExistScreen} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokPinLocation" component={ToktokPinLocation} />
    <Navigator.Screen name="ToktokSavedLocations" component={ToktokSavedLocations} />
    <Navigator.Screen name="ToktokAddEditLocation" component={ToktokAddEditLocation} />
    <Navigator.Screen name="ToktokLocationAccess" component={ToktokLocationAccess} options={{headerShown: false}} />
    <Navigator.Screen name="ContactsScreen" component={ContactsScreen} />
    <Navigator.Screen
      name="SuperAppServiceMaintenance"
      component={SuperAppServiceMaintenance}
      options={{headerShown: false}}
    />
  </>
);
