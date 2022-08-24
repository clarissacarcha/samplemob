import React from 'react';
import {
  ToktokWalletAccountRecovery,
  ToktokWalletAccountRecoveryOTP,
  ToktokWalletAccountRecoverySetup,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokWalletAccountRecovery" component={ToktokWalletAccountRecovery} options={options} />
    <Navigator.Screen
      name="ToktokWalletAccountRecoveryOTP"
      component={ToktokWalletAccountRecoveryOTP}
      options={options}
    />
    <Navigator.Screen
      name="ToktokWalletAccountRecoverySetup"
      component={ToktokWalletAccountRecoverySetup}
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
