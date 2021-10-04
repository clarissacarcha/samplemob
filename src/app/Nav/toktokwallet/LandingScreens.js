import React from 'react';

import {
  ToktokWalletHomePage,
  ToktokWalletLinkAccount,
  ToktokWalletLoadingPage,
  ToktokWalletRestricted,
  ToktokWalletReviewAndConfirm,
  ToktokWalletTransactions,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokWalletHomePage" component={ToktokWalletHomePage} />
    <Navigator.Screen name="ToktokWalletLinkAccount" component={ToktokWalletLinkAccount} />
    <Navigator.Screen name="ToktokWalletLoadingPage" component={ToktokWalletLoadingPage} />
    <Navigator.Screen name="ToktokWalletRestricted" component={ToktokWalletRestricted} />
    <Navigator.Screen name="ToktokWalletReviewAndConfirm" component={ToktokWalletReviewAndConfirm} />
    <Navigator.Screen name="ToktokWalletTransactions" component={ToktokWalletTransactions} />
  </>
);
