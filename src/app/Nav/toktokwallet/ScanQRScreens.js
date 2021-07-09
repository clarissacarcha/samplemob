import React from 'react'

import {
    ToktokWalletScanQR,
    ToktokWalletScanQRConfirm
} from 'toktokwallet/screens'

export default ({Navigator}) => (
    <>
      <Navigator.Screen name="ToktokWalletScanQR" component={ToktokWalletScanQR}/>
      <Navigator.Screen name="ToktokWalletScanQRConfirm" component={ToktokWalletScanQRConfirm}/>
    </>
);