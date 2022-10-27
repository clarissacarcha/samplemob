import React from 'react';
import {
  // Help Centre Screens
  ToktokWalletHelpCentreLayeredSecurity,
  ToktokWalletHelpCentreMoneyProtected,
  ToktokWalletHelpCentreSecurityPrivacy,

  // Pin Code Screens
  ToktokWalletCreatePin,
  ToktokWalletRecoverPin,
  ToktokWalletRecoveryMethods,
  ToktokWalletUpdatePin,

  // Others
  ToktokWalletCashInLogs,
  ToktokWalletCashOutLogs,
  ToktokWalletPaymentChart,
  ToktokWalletSettings,
  ToktokWalletTermsConditions,
  ToktokWalletTransactionLimit,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    {/* Help Centre Screens */}
    <Navigator.Screen
      name="ToktokWalletHelpCentreLayeredSecurity"
      component={ToktokWalletHelpCentreLayeredSecurity}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletHelpCentreMoneyProtected"
      component={ToktokWalletHelpCentreMoneyProtected}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletHelpCentreSecurityPrivacy"
      component={ToktokWalletHelpCentreSecurityPrivacy}
      options={{
        headerTitleAlign: 'center',
      }}
    />

    {/* Pin Code Screens */}
    <Navigator.Screen
      name="ToktokWalletCreatePin"
      component={ToktokWalletCreatePin}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletRecoverPin"
      component={ToktokWalletRecoverPin}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletRecoveryMethods"
      component={ToktokWalletRecoveryMethods}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletUpdatePin"
      component={ToktokWalletUpdatePin}
      options={{
        headerTitleAlign: 'center',
      }}
    />

    {/* Others */}
    <Navigator.Screen
      name="ToktokWalletCashInLogs"
      component={ToktokWalletCashInLogs}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletCashOutLogs"
      component={ToktokWalletCashOutLogs}
      options={{
        headerTitleAlign: 'center',
      }}
    />
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
