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
      options={options}
    />
    <Navigator.Screen
      name="ToktokWalletFullyVerifiedApplication"
      component={ToktokWalletFullyVerifiedApplication}
      options={options}
    />
    <Navigator.Screen name="ToktokWalletUpgradeAccount" component={ToktokWalletUpgradeAccount} options={options} />
    <Navigator.Screen
      name="ToktokWalletVideoCallSchedule"
      component={ToktokWalletVideoCallSchedule}
      options={options}
    />
  </>
);

const options = {
  headerTitleAlign: 'center',
  headerStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
};
