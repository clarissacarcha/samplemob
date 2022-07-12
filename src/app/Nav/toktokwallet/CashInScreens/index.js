import React from 'react';
import PayPandaScreens from './PayPandaScreens';
import {ToktokWalletPaymentOptions, ToktokWalletDPCashInMethods} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen
      name="ToktokWalletDPCashInMethods"
      component={ToktokWalletDPCashInMethods}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletPaymentOptions"
      component={ToktokWalletPaymentOptions}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    {PayPandaScreens({Navigator})}
  </>
);
