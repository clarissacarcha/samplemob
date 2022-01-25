import React from 'react'
import {
    ToktokWalletAccountRecovery,
    ToktokWalletAccountRecoveryOTP,
    ToktokWalletAccountRecoverySetup
} from 'toktokwallet/screens'

export default ({Navigator})=> (
    <>
    <Navigator.Screen name="ToktokWalletAccountRecovery" component={ToktokWalletAccountRecovery}/>
    <Navigator.Screen name="ToktokWalletAccountRecoveryOTP" component={ToktokWalletAccountRecoveryOTP}/>
    <Navigator.Screen name="ToktokWalletAccountRecoverySetup" component={ToktokWalletAccountRecoverySetup}/>
    </>
)