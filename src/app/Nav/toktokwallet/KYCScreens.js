import React from 'react';
import {
  ToktokWalletConfirmImage,
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
    <Navigator.Screen
      name="ToktokWalletConfirmImage"
      component={ToktokWalletConfirmImage}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletPepVideoCallSchedule"
      component={ToktokWalletPepVideoCallSchedule}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletSelfieImageCamera"
      component={ToktokWalletSelfieImageCamera}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletSelfieImageWithIDCamera"
      component={ToktokWalletSelfieImageWithIDCamera}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <Navigator.Screen
      name="ToktokWalletValidIDCamera"
      component={ToktokWalletValidIDCamera}
      options={{
        headerTitleAlign: 'center',
      }}
    />
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
