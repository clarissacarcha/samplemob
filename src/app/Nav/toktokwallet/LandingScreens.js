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
    <Navigator.Screen name="ToktokWalletHomePage" component={ToktokWalletHomePage} options={options} />
    <Navigator.Screen name="ToktokWalletLinkAccount" component={ToktokWalletLinkAccount} options={options} />
    <Navigator.Screen name="ToktokWalletLoginPage" component={ToktokWalletLoginPage} options={options} />
    <Navigator.Screen name="ToktokWalletNotifications" component={ToktokWalletNotifications} options={options} />
    <Navigator.Screen name="ToktokWalletOTPValidator" component={ToktokWalletOTPValidator} options={options} />
    <Navigator.Screen name="ToktokWalletRestricted" component={ToktokWalletRestricted} options={options} />
    <Navigator.Screen name="ToktokWalletReviewAndConfirm" component={ToktokWalletReviewAndConfirm} options={options} />
    <Navigator.Screen name="ToktokWalletTPINValidator" component={ToktokWalletTPINValidator} />
    <Navigator.Screen name="ToktokWalletTransactions" component={ToktokWalletTransactions} options={options} />
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
