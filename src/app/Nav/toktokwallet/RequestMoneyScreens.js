import React from 'react'

import {
    ToktokWalletRequestMoney,
} from 'toktokwallet/screens'

export default ({Navigator}) => (
    <>
        <Navigator.Screen name="ToktokWalletRequestMoney" component={ToktokWalletRequestMoney}/>
    </>
);