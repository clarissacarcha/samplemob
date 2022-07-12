import React from 'react'
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
} from 'toktokwallet/screens'

export default ({Navigator}) => (
    <>
    <Navigator.Screen name="ToktokWalletBillsLogs" component={ToktokWalletBillsLogs}/>
    <Navigator.Screen name="ToktokWalletCashInLogs" component={ToktokWalletCashInLogs}/>
    <Navigator.Screen name="ToktokWalletCashOutLogs" component={ToktokWalletCashOutLogs}/>
    <Navigator.Screen name="ToktokWalletCashOutOtcLogs" component={ToktokWalletCashOutOtcLogs}/>
    <Navigator.Screen name="ToktokWalletFoodLogs" component={ToktokWalletFoodLogs}/>
    <Navigator.Screen name="ToktokWalletLoadLogs" component={ToktokWalletLoadLogs}/>
    <Navigator.Screen name="ToktokWalletMallLogs" component={ToktokWalletMallLogs}/>
    <Navigator.Screen name="ToktokWalletMartLogs" component={ToktokWalletMartLogs}/>
    <Navigator.Screen name="ToktokWalletPabiliDeliveryLogs" component={ToktokWalletPabiliDeliveryLogs}/>
    <Navigator.Screen name="ToktokWalletMerchantPaymentLogs" component={ToktokWalletMerchantPaymentLogs}/>
    <Navigator.Screen name="ToktokWalletMerchantSettlementLogs" component={ToktokWalletMerchantSettlementLogs}/>
    <Navigator.Screen name="ToktokWalletRequestMoneyLogs" component={ToktokWalletRequestMoneyLogs}/>
    <Navigator.Screen name="ToktokWalletSendMoneyLogs" component={ToktokWalletSendMoneyLogs}/>
    </>
);