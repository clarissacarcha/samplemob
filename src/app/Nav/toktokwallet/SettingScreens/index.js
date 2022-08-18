import React from 'react';
import AccountRecoveryScreens from './AccountRecoveryScreens';
import HelpCentreScreens from './HelpCentreScreens';
import PinCodeScreens from './PinCodeScreens';
import UpgradeAccountScreens from './UpgradeAccountScreens';
import LogScreens from './LogScreens';
import {
  ToktokWalletPaymentChart,
  ToktokWalletSettings,
  ToktokWalletTermsConditions,
  ToktokWalletTransactionLimit,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    {AccountRecoveryScreens({Navigator})}
    {HelpCentreScreens({Navigator})}
    {PinCodeScreens({Navigator})}
    {UpgradeAccountScreens({Navigator})}
    {LogScreens({Navigator})}
    <Navigator.Screen
      name="ToktokWalletPaymentChart"
      component={ToktokWalletPaymentChart}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletSettings"
      component={ToktokWalletSettings}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletTermsConditions"
      component={ToktokWalletTermsConditions}
      options={{
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
          // height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80)
        },
      }}
    />
    <Navigator.Screen
      name="ToktokWalletTransactionLimit"
      component={ToktokWalletTransactionLimit}
      options={{
        headerTitleAlign: 'center',
      }}
    />
  </>
);
