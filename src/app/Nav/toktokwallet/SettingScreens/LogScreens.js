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
  ToktokWalletPabiliDeliveryLogs,
  ToktokWalletMerchantPaymentLogs,
  ToktokWalletMerchantSettlementLogs,
  ToktokWalletRequestMoneyLogs,
  ToktokWalletSendMoneyLogs,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen
      name="ToktokWalletBillsLogs"
      component={ToktokWalletBillsLogs}
      options={{
        headerTitleAlign: 'center',
      }}
    />
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
      name="ToktokWalletCashOutOtcLogs"
      component={ToktokWalletCashOutOtcLogs}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletFoodLogs"
      component={ToktokWalletFoodLogs}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletLoadLogs"
      component={ToktokWalletLoadLogs}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletMallLogs"
      component={ToktokWalletMallLogs}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletMartLogs"
      component={ToktokWalletMartLogs}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletPabiliDeliveryLogs"
      component={ToktokWalletPabiliDeliveryLogs}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletMerchantPaymentLogs"
      component={ToktokWalletMerchantPaymentLogs}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletMerchantSettlementLogs"
      component={ToktokWalletMerchantSettlementLogs}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletRequestMoneyLogs"
      component={ToktokWalletRequestMoneyLogs}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletSendMoneyLogs"
      component={ToktokWalletSendMoneyLogs}
      options={{
        headerTitleAlign: 'center',
      }}
    />
  </>
);
