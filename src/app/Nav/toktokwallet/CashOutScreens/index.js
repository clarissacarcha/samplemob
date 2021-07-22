import React from 'react'
import BDOScreens from './BDOScreens';
import GCashScreens from './GCashScreens';
import OtherBanksScreens from './OtherBanksScreens';

import {
    ToktokWalletCashOut,
    ToktokWalletCashOutHomePage
} from 'toktokwallet/screens'

export default ({Navigator})=> (
    <>
    {BDOScreens({Navigator})}
    {GCashScreens({Navigator})}
    {OtherBanksScreens({Navigator})}
    <Navigator.Screen name="ToktokWalletCashOut" component={ToktokWalletCashOut}/>
    <Navigator.Screen name="ToktokWalletCashOutHomePage" component={ToktokWalletCashOutHomePage}/>
    </>
)