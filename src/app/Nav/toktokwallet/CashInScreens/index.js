import React from 'react';
import PayPandaScreens from './PayPandaScreens';
import {
    ToktokWalletPaymentOptions
} from 'toktokwallet/screens';

export default ({Navigator})=> (
    <>
    <Navigator.Screen name="ToktokWalletPaymentOptions" component={ToktokWalletPaymentOptions}/>
    {PayPandaScreens({Navigator})}
    </>
)