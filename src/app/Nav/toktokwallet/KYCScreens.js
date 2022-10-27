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
    <Navigator.Screen name="ToktokWalletConfirmImage" component={ToktokWalletConfirmImage} options={options} />
    <Navigator.Screen
      name="ToktokWalletPepVideoCallSchedule"
      component={ToktokWalletPepVideoCallSchedule}
      options={options}
    />
    <Navigator.Screen
      name="ToktokWalletSelfieImageCamera"
      component={ToktokWalletSelfieImageCamera}
      options={options}
    />
    <Navigator.Screen
      name="ToktokWalletSelfieImageWithIDCamera"
      component={ToktokWalletSelfieImageWithIDCamera}
      options={options}
    />
    <Navigator.Screen name="ToktokWalletValidIDCamera" component={ToktokWalletValidIDCamera} options={options} />
    <Navigator.Screen name="ToktokWalletVerification" component={ToktokWalletVerification} options={options} />
    <Navigator.Screen
      name="ToktokWalletVerifyResult"
      component={ToktokWalletVerifyResult}
      options={{headerShown: false}}
    />
    <Navigator.Screen name="ToktokWalletVerifySetup" component={ToktokWalletVerifySetup} />
  </>
);

const options = {
  headerTitleAlign: 'center',
  headerStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
};
