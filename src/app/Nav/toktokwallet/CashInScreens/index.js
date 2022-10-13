import React from 'react';
import PayPandaScreens from './PayPandaScreens';
import {
  ToktokWalletPaymentOptions,
  ToktokWalletDpCashInPaymentSummary,
  ToktokWalletDPCashInMethods,
  ToktokWalletDpCashInReceipt,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokWalletDPCashInMethods" component={ToktokWalletDPCashInMethods} options={options} />
    <Navigator.Screen
      name="ToktokWalletDpCashInPaymentSummary"
      component={ToktokWalletDpCashInPaymentSummary}
      options={options}
    />
    <Navigator.Screen name="ToktokWalletPaymentOptions" component={ToktokWalletPaymentOptions} options={options} />
    <Navigator.Screen name="ToktokWalletDpCashInReceipt" component={ToktokWalletDpCashInReceipt} options={options} />
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
