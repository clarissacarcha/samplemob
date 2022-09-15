import React from 'react';
import PayPandaScreens from './PayPandaScreens';
import {ToktokWalletPaymentOptions, ToktokWalletDPCashInMethods} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokWalletDPCashInMethods" component={ToktokWalletDPCashInMethods} options={options} />
    <Navigator.Screen name="ToktokWalletPaymentOptions" component={ToktokWalletPaymentOptions} options={options} />
    {PayPandaScreens({Navigator})}
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
