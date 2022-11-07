import React from 'react';
import {ToktokBillsSssTransaction, ToktokBillsTransaction} from 'toktokbills/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokBillsSssTransaction" component={ToktokBillsSssTransaction} options={options} />
    <Navigator.Screen name="ToktokBillsTransaction" component={ToktokBillsTransaction} options={options} />
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
