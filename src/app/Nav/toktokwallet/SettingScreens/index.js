import React from 'react'
import AccountRecoveryScreens from './AccountRecoveryScreens';
import HelpCentreScreens from './HelpCentreScreens';
import PinCodeScreens from './PinCodeScreens';
import UpgradeAccountScreens from './UpgradeAccountScreens';
import {
    ToktokWalletBillsLogs,
    ToktokWalletCashInLogs,
    ToktokWalletCashOutLogs,
    ToktokWalletFoodLogs,
    ToktokWalletLoadLogs,
    ToktokWalletMallLogs,
    ToktokWalletMartLogs,
    ToktokWalletPabiliDeliveryLogs,
    ToktokWalletMerchantPaymentLogs,
    ToktokWalletPaymentChart,
    ToktokWalletRequestMoneyLogs,
    ToktokWalletSendMoneyLogs,
    ToktokWalletSettings,
    ToktokWalletTermsConditions,
    ToktokWalletTransactionLimit
} from 'toktokwallet/screens'

export default ({Navigator}) => (
    <>
    {AccountRecoveryScreens({Navigator})}
    {HelpCentreScreens({Navigator})}
    {PinCodeScreens({Navigator})}
    {UpgradeAccountScreens({Navigator})}
    <Navigator.Screen name="ToktokWalletBillsLogs" component={ToktokWalletBillsLogs}/>
    <Navigator.Screen name="ToktokWalletCashInLogs" component={ToktokWalletCashInLogs}/>
    <Navigator.Screen name="ToktokWalletCashOutLogs" component={ToktokWalletCashOutLogs}/>
    <Navigator.Screen name="ToktokWalletFoodLogs" component={ToktokWalletFoodLogs}/>
    <Navigator.Screen name="ToktokWalletLoadLogs" component={ToktokWalletLoadLogs}/>
    <Navigator.Screen name="ToktokWalletMallLogs" component={ToktokWalletMallLogs}/>
    <Navigator.Screen name="ToktokWalletMartLogs" component={ToktokWalletMartLogs}/>
    <Navigator.Screen name="ToktokWalletPabiliDeliveryLogs" component={ToktokWalletPabiliDeliveryLogs}/>
    <Navigator.Screen name="ToktokWalletMerchantPaymentLogs" component={ToktokWalletMerchantPaymentLogs}/>
    <Navigator.Screen name="ToktokWalletPaymentChart" component={ToktokWalletPaymentChart}/>
    <Navigator.Screen name="ToktokWalletRequestMoneyLogs" component={ToktokWalletRequestMoneyLogs}/>
    <Navigator.Screen name="ToktokWalletSendMoneyLogs" component={ToktokWalletSendMoneyLogs}/>
    <Navigator.Screen name="ToktokWalletSettings" component={ToktokWalletSettings}/>
    <Navigator.Screen name="ToktokWalletTermsConditions" component={ToktokWalletTermsConditions}/>
    <Navigator.Screen name="ToktokWalletTransactionLimit" component={ToktokWalletTransactionLimit}/>
    </>
);