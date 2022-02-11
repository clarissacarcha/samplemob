import React from 'react';
import PayPandaScreens from './PayPandaScreens';
import {
    ToktokWalletPaymentOptions,
    ToktokWalletDPCashInMethods
} from 'toktokwallet/screens';

export default ({Navigator})=> (
    <>
    <Navigator.Screen name="ToktokWalletDPCashInMethods" component={ToktokWalletDPCashInMethods}/>
    <Navigator.Screen name="ToktokWalletPaymentOptions" component={ToktokWalletPaymentOptions}/>
    {PayPandaScreens({Navigator})}
    </>
)