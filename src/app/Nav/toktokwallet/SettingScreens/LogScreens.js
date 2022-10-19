import React from 'react';
import {
  ToktokWalletBillsLogs,
  ToktokWalletCashInLogs,
  ToktokWalletCashOutLogs,
  ToktokWalletCashOutOtcLogs,
  ToktokWalletFoodLogs,
  ToktokWalletLoadLogs,
  ToktokWalletMallLogs,
  ToktokWalletMartLogs,
  ToktokWalletMerchantPaymentLogs,
  ToktokWalletMerchantSettlementLogs,
  ToktokWalletPabiliDeliveryLogs,
  ToktokWalletReceiveMoneyLogs,
  ToktokWalletRequestMoneyLogs,
  ToktokWalletSendMoneyLogs,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokWalletBillsLogs" component={ToktokWalletBillsLogs} options={options} />
    <Navigator.Screen name="ToktokWalletCashInLogs" component={ToktokWalletCashInLogs} options={options} />
    <Navigator.Screen name="ToktokWalletCashOutLogs" component={ToktokWalletCashOutLogs} options={options} />
    <Navigator.Screen name="ToktokWalletCashOutOtcLogs" component={ToktokWalletCashOutOtcLogs} options={options} />
    <Navigator.Screen name="ToktokWalletFoodLogs" component={ToktokWalletFoodLogs} options={options} />
    <Navigator.Screen name="ToktokWalletLoadLogs" component={ToktokWalletLoadLogs} options={options} />
    <Navigator.Screen name="ToktokWalletMallLogs" component={ToktokWalletMallLogs} options={options} />
    <Navigator.Screen name="ToktokWalletMartLogs" component={ToktokWalletMartLogs} options={options} />
    <Navigator.Screen
      name="ToktokWalletPabiliDeliveryLogs"
      component={ToktokWalletPabiliDeliveryLogs}
      options={options}
    />
    <Navigator.Screen
      name="ToktokWalletMerchantPaymentLogs"
      component={ToktokWalletMerchantPaymentLogs}
      options={options}
    />
    <Navigator.Screen
      name="ToktokWalletMerchantSettlementLogs"
      component={ToktokWalletMerchantSettlementLogs}
      options={options}
      options={options}
    />
    <Navigator.Screen name="ToktokWalletReceiveMoneyLogs" component={ToktokWalletReceiveMoneyLogs} options={options} />
    <Navigator.Screen name="ToktokWalletRequestMoneyLogs" component={ToktokWalletRequestMoneyLogs} options={options} />
    <Navigator.Screen name="ToktokWalletSendMoneyLogs" component={ToktokWalletSendMoneyLogs} options={options} />
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
