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
    <Navigator.Screen
      name="ToktokWalletHomePage"
      component={ToktokWalletHomePage}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletLinkAccount"
      component={ToktokWalletLinkAccount}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletLoginPage"
      component={ToktokWalletLoginPage}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletNotifications"
      component={ToktokWalletNotifications}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletOTPValidator"
      component={ToktokWalletOTPValidator}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletRestricted"
      component={ToktokWalletRestricted}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletReviewAndConfirm"
      component={ToktokWalletReviewAndConfirm}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen name="ToktokWalletTPINValidator" component={ToktokWalletTPINValidator} />
    <Navigator.Screen
      name="ToktokWalletTransactions"
      component={ToktokWalletTransactions}
      options={{
        headerTitleAlign: 'center',
        headerStyle: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
      }}
    />
  </>
);
