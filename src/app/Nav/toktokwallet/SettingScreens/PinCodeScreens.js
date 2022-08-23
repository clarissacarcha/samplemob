import React from 'react';
import {
  ToktokWalletCreatePin,
  ToktokWalletMPINCreate,
  ToktokWalletMPINUpdate,
  ToktokWalletRecoverPin,
  ToktokWalletRecoveryMethods,
  ToktokWalletUpdatePin,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen
      name="ToktokWalletCreatePin"
      component={ToktokWalletCreatePin}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletMPINCreate"
      component={ToktokWalletMPINCreate}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletMPINUpdate"
      component={ToktokWalletMPINUpdate}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletRecoverPin"
      component={ToktokWalletRecoverPin}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletRecoveryMethods"
      component={ToktokWalletRecoveryMethods}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletUpdatePin"
      component={ToktokWalletUpdatePin}
      options={{
        headerTitleAlign: 'center',
      }}
    />
  </>
);
