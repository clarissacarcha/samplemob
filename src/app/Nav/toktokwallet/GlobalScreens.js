import React from 'react';
import {ToktokWalletBalanceInfo, ToktokWalletContacts} from 'toktokwallet/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokWalletBalanceInfo" component={ToktokWalletBalanceInfo} options={options} />
    <Navigator.Screen name="ToktokWalletContacts" component={ToktokWalletContacts} options={options} />
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
