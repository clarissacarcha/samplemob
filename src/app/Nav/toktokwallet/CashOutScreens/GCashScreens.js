import React from 'react'
import {
    ToktokWalletGcashHomePage,
    ToktokWalletGcashLinkAccount,
    ToktokWalletGcashRegistration,
    ToktokWalletGcashUpdate
} from 'toktokwallet/screens'

export default ({Navigator})=> (
    <>
    <Navigator.Screen name="ToktokWalletGcashHomePage" component={ToktokWalletGcashHomePage}/>
    <Navigator.Screen name="ToktokWalletGcashLinkAccount" component={ToktokWalletGcashLinkAccount}/>
    <Navigator.Screen name="ToktokWalletGcashRegistration" component={ToktokWalletGcashRegistration}/>
    <Navigator.Screen name="ToktokWalletGcashUpdate" component={ToktokWalletGcashUpdate}/>
    </>
)