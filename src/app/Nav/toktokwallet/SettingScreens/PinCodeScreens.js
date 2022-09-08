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
    <Navigator.Screen name="ToktokWalletCreatePin" component={ToktokWalletCreatePin} options={options} />
    <Navigator.Screen name="ToktokWalletMPINCreate" component={ToktokWalletMPINCreate} options={options} />
    <Navigator.Screen name="ToktokWalletMPINUpdate" component={ToktokWalletMPINUpdate} options={options} />
    <Navigator.Screen name="ToktokWalletRecoverPin" component={ToktokWalletRecoverPin} options={options} />
    <Navigator.Screen name="ToktokWalletRecoveryMethods" component={ToktokWalletRecoveryMethods} options={options} />
    <Navigator.Screen name="ToktokWalletUpdatePin" component={ToktokWalletUpdatePin} options={options} />
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
