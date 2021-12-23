import React from 'react'
import {
    ToktokWalletCreatePin,
    ToktokWalletMPINCreate,
    ToktokWalletMPINUpdate,
    ToktokWalletRecoverPin,
    ToktokWalletRecoveryMethods,
    ToktokWalletUpdatePin,
} from 'toktokwallet/screens'

export default ({Navigator}) => (
    <>
    <Navigator.Screen name="ToktokWalletCreatePin" component={ToktokWalletCreatePin}/>
    <Navigator.Screen name="ToktokWalletMPINCreate" component={ToktokWalletMPINCreate}/>
    <Navigator.Screen name="ToktokWalletMPINUpdate" component={ToktokWalletMPINUpdate}/>
    <Navigator.Screen name="ToktokWalletRecoverPin" component={ToktokWalletRecoverPin}/>
    <Navigator.Screen name="ToktokWalletRecoveryMethods" component={ToktokWalletRecoveryMethods}/>
    <Navigator.Screen name="ToktokWalletUpdatePin" component={ToktokWalletUpdatePin}/>
    </>
);