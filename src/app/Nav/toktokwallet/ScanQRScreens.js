import React from 'react';

import {
  ToktokWalletMerchantPayment,
  ToktokWalletMerchantPaymentConfirm,
  ToktokWalletScanQR,
  ToktokWalletScanQRConfirm,
  ToktokWalletScanQrHome,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokWalletMerchantPayment" component={ToktokWalletMerchantPayment} options={options} />
    <Navigator.Screen
      name="ToktokWalletMerchantPaymentConfirm"
      component={ToktokWalletMerchantPaymentConfirm}
      options={options}
    />
    <Navigator.Screen name="ToktokWalletScanQR" component={ToktokWalletScanQR} options={options} />
    <Navigator.Screen name="ToktokWalletScanQRConfirm" component={ToktokWalletScanQRConfirm} options={options} />
    <Navigator.Screen name="ToktokWalletScanQrHome" component={ToktokWalletScanQrHome} options={options} />
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
