import React from 'react'
import {
    ToktokWalletEnterpriseApplication,
    ToktokWalletUpgradeAccount
} from 'toktokwallet/screens'

export default ({Navigator}) => (
    <>
    <Navigator.Screen name="ToktokWalletEnterpriseApplication" component={ToktokWalletEnterpriseApplication}/>
    <Navigator.Screen name="ToktokWalletUpgradeAccount" component={ToktokWalletUpgradeAccount}/>
    </>
);