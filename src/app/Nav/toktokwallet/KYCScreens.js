import React from 'react'
import {
    ToktokWalletPepVideoCallSchedule,
    ToktokWalletSelfieImageCamera,
    ToktokWalletSelfieImageWithIDCamera,
    ToktokWalletValidIDCamera,
    ToktokWalletVerification,
    ToktokWalletVerifyResult,
    ToktokWalletVerifySetup
} from 'toktokwallet/screens'

export default ({Navigator}) => (
    <>
    <Navigator.Screen name="ToktokWalletPepVideoCallSchedule" component={ToktokWalletPepVideoCallSchedule}/>
    <Navigator.Screen name="ToktokWalletSelfieImageCamera" component={ToktokWalletSelfieImageCamera}/>
    <Navigator.Screen name="ToktokWalletSelfieImageWithIDCamera" component={ToktokWalletSelfieImageWithIDCamera}/>
    <Navigator.Screen name="ToktokWalletValidIDCamera" component={ToktokWalletValidIDCamera}/>
    <Navigator.Screen name="ToktokWalletVerification" component={ToktokWalletVerification}/>
    <Navigator.Screen name="ToktokWalletVerifyResult" component={ToktokWalletVerifyResult} options={{headerShown: false}}/>
    <Navigator.Screen name="ToktokWalletVerifySetup" component={ToktokWalletVerifySetup}/>
    </>
);