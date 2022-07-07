import React from 'react';
import {
  ToktokWalletPepVideoCallSchedule,
  ToktokWalletSelfieImageCamera,
  ToktokWalletSelfieImageWithIDCamera,
  ToktokWalletValidIDCamera,
  ToktokWalletVerification,
  ToktokWalletVerifyResult,
  ToktokWalletVerifySetup,
} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokWalletPepVideoCallSchedule" component={ToktokWalletPepVideoCallSchedule} />
    <Navigator.Screen name="ToktokWalletSelfieImageCamera" component={ToktokWalletSelfieImageCamera} />
    <Navigator.Screen name="ToktokWalletSelfieImageWithIDCamera" component={ToktokWalletSelfieImageWithIDCamera} />
    <Navigator.Screen name="ToktokWalletValidIDCamera" component={ToktokWalletValidIDCamera} />
    <Navigator.Screen
      name="ToktokWalletVerification"
      component={ToktokWalletVerification}
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
      name="ToktokWalletVerifyResult"
      component={ToktokWalletVerifyResult}
      options={{headerShown: false}}
    />
    <Navigator.Screen name="ToktokWalletVerifySetup" component={ToktokWalletVerifySetup} />
  </>
);
