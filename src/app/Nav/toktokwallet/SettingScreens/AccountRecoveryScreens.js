import React from 'react'
import {
    ToktokWalletAccountRecovery,
    ToktokWalletAccountRecoverySetup
} from 'toktokwallet/screens'

export default ({Navigator})=> (
    <>
    <Navigator.Screen name="ToktokWalletAccountRecovery" component={ToktokWalletAccountRecovery}/>
    <Navigator.Screen name="ToktokWalletAccountRecoverySetup" component={ToktokWalletAccountRecoverySetup}/>
    </>
)