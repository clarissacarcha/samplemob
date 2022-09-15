import React from 'react';
import AccountRecoveryScreens from './AccountRecoveryScreens';
import AccountScreens from './AccountScreens';
import HelpCentreScreens from './HelpCentreScreens';
import PinCodeScreens from './PinCodeScreens';
import LogScreens from './LogScreens';
import {ToktokWalletSettings} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    {AccountRecoveryScreens({Navigator})}
    {AccountScreens({Navigator})}
    {HelpCentreScreens({Navigator})}
    {PinCodeScreens({Navigator})}
    {LogScreens({Navigator})}
    <Navigator.Screen name="ToktokWalletSettings" component={ToktokWalletSettings} options={options} />
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
