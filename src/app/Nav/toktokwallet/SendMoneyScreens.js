import React from 'react';

import {
  ToktokWalletSendMoney,
  ToktokWalletSendMoneyPaymentSummary,
  ToktokWalletSendMoneyReceipt,
  ToktokWalletSendMoneyTransaction,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokWalletSendMoney" component={ToktokWalletSendMoney} options={options} />
    <Navigator.Screen
      name="ToktokWalletSendMoneyPaymentSummary"
      component={ToktokWalletSendMoneyPaymentSummary}
      options={options}
    />
    <Navigator.Screen name="ToktokWalletSendMoneyReceipt" component={ToktokWalletSendMoneyReceipt} options={options} />
    <Navigator.Screen
      name="ToktokWalletSendMoneyTransaction"
      component={ToktokWalletSendMoneyTransaction}
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
