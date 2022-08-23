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
    <Navigator.Screen
      name="ToktokWalletMerchantPayment"
      component={ToktokWalletMerchantPayment}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletMerchantPaymentConfirm"
      component={ToktokWalletMerchantPaymentConfirm}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletScanQR"
      component={ToktokWalletScanQR}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletScanQRConfirm"
      component={ToktokWalletScanQRConfirm}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletScanQrHome"
      component={ToktokWalletScanQrHome}
      options={{
        headerTitleAlign: 'center',
      }}
    />
  </>
);
