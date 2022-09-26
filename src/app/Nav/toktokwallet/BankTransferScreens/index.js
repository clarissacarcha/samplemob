import React from 'react';
import {
  ToktokWalletBankTransferBanks,
  ToktokWalletBankTransferHome,
  ToktokWalletBankTransferPaymentSummary,
  ToktokWalletBankTransferReceipt,
  ToktokWalletBankTransferTransaction,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen
      name="ToktokWalletBankTransferBanks"
      component={ToktokWalletBankTransferBanks}
      options={options}
    />
    <Navigator.Screen name="ToktokWalletBankTransferHome" component={ToktokWalletBankTransferHome} options={options} />
    <Navigator.Screen
      name="ToktokWalletBankTransferPaymentSummary"
      component={ToktokWalletBankTransferPaymentSummary}
      options={options}
    />
    <Navigator.Screen
      name="ToktokWalletBankTransferReceipt"
      component={ToktokWalletBankTransferReceipt}
      options={options}
    />
    <Navigator.Screen
      name="ToktokWalletBankTransferTransaction"
      component={ToktokWalletBankTransferTransaction}
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
