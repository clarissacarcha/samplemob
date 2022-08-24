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
      options={options}
    />
    <Navigator.Screen
      name="ToktokWalletHelpCentreLayeredSecurity"
      component={ToktokWalletHelpCentreLayeredSecurity}
      options={options}
    />
    <Navigator.Screen
      name="ToktokWalletHelpCentreMoneyProtected"
      component={ToktokWalletHelpCentreMoneyProtected}
      options={options}
    />
    <Navigator.Screen
      name="ToktokWalletHelpCentreSecurityPrivacy"
      component={ToktokWalletHelpCentreSecurityPrivacy}
      options={options}
    />
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
