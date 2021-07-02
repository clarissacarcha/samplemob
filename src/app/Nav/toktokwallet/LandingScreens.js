import React from 'react'

import {
    ToktokWalletHomePage,
    ToktokWalletTransactions,
} from 'toktokwallet/screens'

export default ({Navigator}) => (
    <>
    <Navigator.Screen name="ToktokWalletHomePage" component={ToktokWalletHomePage}/>
    <Navigator.Screen name="ToktokWalletTransactions" component={ToktokWalletTransactions}/>
    </>
);