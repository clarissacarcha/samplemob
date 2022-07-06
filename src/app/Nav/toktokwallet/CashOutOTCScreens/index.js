import React from 'react';
import {ToktokWalletCashOutOTCHome, ToktokWalletCashOutOTCReceipt} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen
      name="ToktokWalletCashOutOTCHome"
      component={ToktokWalletCashOutOTCHome}
      options={{
        headerTitleAlign: 'center',
        headerStyle: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
      }}
    />
    <Navigator.Screen
      name="ToktokWalletCashOutOTCReceipt"
      component={ToktokWalletCashOutOTCReceipt}
      options={{
        headerTitleAlign: 'center',
        headerStyle: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
      }}
    />
  </>
);
