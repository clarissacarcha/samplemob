import React from 'react'
import {
    ToktokWalletCashOutOtherBanks,
    ToktokWalletCashOutSaveAccount,
    ToktokWalletCashOutUpdateAccount,
    ToktokWalletCashOutViewAccount
} from 'toktokwallet/screens'
export default ({Navigator})=> (
    <>
    <Navigator.Screen name="ToktokWalletCashOutOtherBanks" component={ToktokWalletCashOutOtherBanks}/>
    <Navigator.Screen name="ToktokWalletCashOutSaveAccount" component={ToktokWalletCashOutSaveAccount}/>
    <Navigator.Screen name="ToktokWalletCashOutUpdateAccount" component={ToktokWalletCashOutUpdateAccount}/>
    <Navigator.Screen name="ToktokWalletCashOutViewAccount" component={ToktokWalletCashOutViewAccount}/>
    </>
)