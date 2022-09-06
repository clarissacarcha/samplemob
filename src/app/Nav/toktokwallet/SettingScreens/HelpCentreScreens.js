import React from 'react';
import {
  ToktokWalletHelpCentreContactUs,
  ToktokWalletHelpCentreSecurityPrivacy,
  ToktokWalletTermsConditions,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen
      name="ToktokWalletHelpCentreContactUs"
      component={ToktokWalletHelpCentreContactUs}
      options={options}
    />
    <Navigator.Screen
      name="ToktokWalletHelpCentreSecurityPrivacy"
      component={ToktokWalletHelpCentreSecurityPrivacy}
      options={options}
    />
    <Navigator.Screen name="ToktokWalletTermsConditions" component={ToktokWalletTermsConditions} options={options} />
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
