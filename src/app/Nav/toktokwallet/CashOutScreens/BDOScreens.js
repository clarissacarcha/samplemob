import React from 'react'
import {
    ToktokWalletBDOHomePage,
    ToktokWalletBDOLinkAccount,
    ToktokWalletBDORegistration
} from 'toktokwallet/screens';

export default ({Navigator})=> (
    <>
    <Navigator.Screen name="ToktokWalletBDOHomePage" component={ToktokWalletBDOHomePage}/>
    <Navigator.Screen name="ToktokWalletBDOLinkAccount" component={ToktokWalletBDOLinkAccount}/>
    <Navigator.Screen name="ToktokWalletBDORegistration" component={ToktokWalletBDORegistration}/>
    </>
)