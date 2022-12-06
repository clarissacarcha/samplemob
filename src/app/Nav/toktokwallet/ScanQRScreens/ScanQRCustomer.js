import React from 'react';
import {
  ToktokWalletScanQRTransaction,
  ToktokWalletScanQRReceipt,
  ToktokWalletScanQRPaymentSummary,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen
      name="ToktokWalletScanQRPaymentSummary"
      component={ToktokWalletScanQRPaymentSummary}
      options={options}
    />
    <Navigator.Screen name="ToktokWalletScanQRReceipt" component={ToktokWalletScanQRReceipt} options={options} />
    <Navigator.Screen
      name="ToktokWalletScanQRTransaction"
      component={ToktokWalletScanQRTransaction}
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
