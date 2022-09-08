import React from 'react';
import {
  ToktokWalletCashOutOTCHome,
  ToktokWalletCashOutOTCPaymentSummary,
  ToktokWalletCashOutOTCReceipt,
  ToktokWalletCashOutOTCTransaction,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokWalletCashOutOTCHome" component={ToktokWalletCashOutOTCHome} options={options} />
    <Navigator.Screen
      name="ToktokWalletCashOutOTCPaymentSummary"
      component={ToktokWalletCashOutOTCPaymentSummary}
      options={options}
    />
    <Navigator.Screen
      name="ToktokWalletCashOutOTCReceipt"
      component={ToktokWalletCashOutOTCReceipt}
      options={options}
    />
    <Navigator.Screen
      name="ToktokWalletCashOutOTCTransaction"
      component={ToktokWalletCashOutOTCTransaction}
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
