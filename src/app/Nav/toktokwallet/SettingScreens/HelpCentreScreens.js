import React from 'react';
import {
  ToktokWalletHelpCentreContactUs,
  ToktokWalletHelpCentreLayeredSecurity,
  ToktokWalletHelpCentreMoneyProtected,
  ToktokWalletHelpCentreSecurityPrivacy,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen
      name="ToktokWalletHelpCentreContactUs"
      component={ToktokWalletHelpCentreContactUs}
      options={{
        headerTitleAlign: 'center',
      }}
    />
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
  </>
);
