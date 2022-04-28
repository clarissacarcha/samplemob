import React from 'react'

import {
    ToktokWalletMerchantPayment,
    ToktokWalletMerchantPaymentConfirm,
    ToktokWalletScanQR,
    ToktokWalletScanQRConfirm,
    ToktokWalletScanQrHome
} from 'toktokwallet/screens'

export default ({Navigator}) => (
    <>
      <Navigator.Screen name="ToktokWalletMerchantPayment" component={ToktokWalletMerchantPayment}/>
      <Navigator.Screen name="ToktokWalletMerchantPaymentConfirm" component={ToktokWalletMerchantPaymentConfirm}/>
      <Navigator.Screen name="ToktokWalletScanQR" component={ToktokWalletScanQR}/>
      <Navigator.Screen name="ToktokWalletScanQRConfirm" component={ToktokWalletScanQRConfirm}/>
      <Navigator.Screen name="ToktokWalletScanQrHome" component={ToktokWalletScanQrHome}/>
    </>
);