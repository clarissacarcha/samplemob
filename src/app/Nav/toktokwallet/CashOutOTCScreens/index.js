import React from 'react';
import {ToktokWalletCashOutOTCHome, ToktokWalletCashOutOTCReceipt} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokWalletCashOutOTCHome" component={ToktokWalletCashOutOTCHome} />
    <Navigator.Screen name="ToktokWalletCashOutOTCReceipt" component={ToktokWalletCashOutOTCReceipt} />
  </>
);
