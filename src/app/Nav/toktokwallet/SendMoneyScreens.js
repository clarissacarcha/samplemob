import React from 'react';

import {ToktokWalletContacts, ToktokWalletSendMoney} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen
      name="ToktokWalletContacts"
      component={ToktokWalletContacts}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletSendMoney"
      component={ToktokWalletSendMoney}
      options={{
        headerTitleAlign: 'center',
      }}
    />
  </>
);
