import React from 'react';
import {
  ToktokWalletMerchantPaymentSummary,
  ToktokWalletMerchantPaymentReceipt,
  ToktokWalletMerchantPaymentTransaction,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen
      name="ToktokWalletMerchantPaymentSummary"
      component={ToktokWalletMerchantPaymentSummary}
      options={options}
    />
    <Navigator.Screen
      name="ToktokWalletMerchantPaymentReceipt"
      component={ToktokWalletMerchantPaymentReceipt}
      options={options}
    />
    <Navigator.Screen
      name="ToktokWalletMerchantPaymentTransaction"
      component={ToktokWalletMerchantPaymentTransaction}
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
