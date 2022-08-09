import React from 'react';
import {
  ToktokWalletEnterpriseApplication,
  ToktokWalletFullyVerifiedApplication,
  ToktokWalletUpgradeAccount,
  ToktokWalletVideoCallSchedule,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen
      name="ToktokWalletEnterpriseApplication"
      component={ToktokWalletEnterpriseApplication}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletFullyVerifiedApplication"
      component={ToktokWalletFullyVerifiedApplication}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletUpgradeAccount"
      component={ToktokWalletUpgradeAccount}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletVideoCallSchedule"
      component={ToktokWalletVideoCallSchedule}
      options={{
        headerTitleAlign: 'center',
      }}
    />
  </>
);
