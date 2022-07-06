import React from 'react';
import {ToktokWalletCashOutOTCHome, ToktokWalletCashOutOTCPaymentSummary} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokWalletCashOutOTCHome" component={ToktokWalletCashOutOTCHome} />
    <Navigator.Screen name="ToktokWalletCashOutOTCPaymentSummary" component={ToktokWalletCashOutOTCPaymentSummary} />
  </>
);
