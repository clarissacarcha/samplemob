import React from 'react';

import {
  ToktokWalletHomePage,
  ToktokWalletLinkAccount,
  ToktokWalletLoginPage,
  ToktokWalletNotifications,
  ToktokWalletOTPValidator,
  ToktokWalletRestricted,
  ToktokWalletReviewAndConfirm,
  ToktokWalletTPINValidator,
  ToktokWalletTransactions,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokWalletHomePage" component={ToktokWalletHomePage} />
    <Navigator.Screen name="ToktokWalletLinkAccount" component={ToktokWalletLinkAccount} />
    <Navigator.Screen name="ToktokWalletLoginPage" component={ToktokWalletLoginPage} />
    <Navigator.Screen name="ToktokWalletNotifications" component={ToktokWalletNotifications}/>
    <Navigator.Screen name="ToktokWalletOTPValidator" component={ToktokWalletOTPValidator}/>
    <Navigator.Screen name="ToktokWalletRestricted" component={ToktokWalletRestricted} />
    <Navigator.Screen name="ToktokWalletReviewAndConfirm" component={ToktokWalletReviewAndConfirm} />
    <Navigator.Screen name="ToktokWalletTPINValidator" component={ToktokWalletTPINValidator}/>
    <Navigator.Screen name="ToktokWalletTransactions" component={ToktokWalletTransactions} />
  </>
);
