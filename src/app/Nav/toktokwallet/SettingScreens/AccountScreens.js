import React from 'react';
import {ToktokWalletPaymentChart, ToktokWalletTransactionLimit} from 'toktokwallet/screens';
import UpgradeAccountScreens from './UpgradeAccountScreens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokWalletPaymentChart" component={ToktokWalletPaymentChart} options={options} />
    <Navigator.Screen name="ToktokWalletTransactionLimit" component={ToktokWalletTransactionLimit} options={options} />
    {UpgradeAccountScreens({Navigator})}
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
