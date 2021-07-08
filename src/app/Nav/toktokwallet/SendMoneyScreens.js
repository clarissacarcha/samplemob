import React from 'react'

import {
    ToktokWalletContacts,
    ToktokWalletSendMoney,
} from 'toktokwallet/screens'

export default ({Navigator}) => (
    <>
    <Navigator.Screen name="ToktokWalletContacts" component={ToktokWalletContacts}/>
    <Navigator.Screen name="ToktokWalletSendMoney" component={ToktokWalletSendMoney}/>
    </>
);