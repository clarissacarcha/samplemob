import React from 'react'
import HelpCentreScreens from './HelpCentreScreens';
import PinCodeScreens from './PinCodeScreens';
import UpgradeAccountScreens from './UpgradeAccountScreens';
import {
    ToktokWalletCashInLogs,
    ToktokWalletCashOutLogs,
    ToktokWalletPaymentChart,
    ToktokWalletSettings,
    ToktokWalletTermsConditions,
    ToktokWalletTransactionLimit
} from 'toktokwallet/screens'

export default ({Navigator}) => (
    <>
    {HelpCentreScreens({Navigator})}
    {PinCodeScreens({Navigator})}
    {UpgradeAccountScreens({Navigator})}
    <Navigator.Screen name="ToktokWalletCashInLogs" component={ToktokWalletCashInLogs}/>
    <Navigator.Screen name="ToktokWalletCashOutLogs" component={ToktokWalletCashOutLogs}/>
    <Navigator.Screen name="ToktokWalletPaymentChart" component={ToktokWalletPaymentChart}/>
    <Navigator.Screen name="ToktokWalletSettings" component={ToktokWalletSettings}/>
    <Navigator.Screen name="ToktokWalletTermsConditions" component={ToktokWalletTermsConditions}/>
    <Navigator.Screen name="ToktokWalletTransactionLimit" component={ToktokWalletTransactionLimit}/>
    </>
);