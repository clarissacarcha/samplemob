import React from 'react'
import {
    ToktokWalletEnterpriseApplication,
    ToktokWalletUpgradeAccount,
    ToktokWalletVideoCallSchedule
} from 'toktokwallet/screens'

export default ({Navigator}) => (
    <>
    <Navigator.Screen name="ToktokWalletEnterpriseApplication" component={ToktokWalletEnterpriseApplication}/>
    <Navigator.Screen name="ToktokWalletUpgradeAccount" component={ToktokWalletUpgradeAccount}/>
    <Navigator.Screen name="ToktokWalletVideoCallSchedule" component={ToktokWalletVideoCallSchedule}/>
    </>
);