import React from 'react';
import {Platform} from 'react-native';
import {moderateScale} from 'toktokbills/helper';
import {
  ToktokBiller,
  ToktokBillsFavorites,
  ToktokBillsHome,
  ToktokBillsPaymentSummary,
  ToktokBillsPaymentProcess,
} from 'toktokbills/screens';
import TransactionScreens from './TransactionScreens';

export default ({Navigator}) => {
  return (
    <>
      <Navigator.Screen name="ToktokBiller" component={ToktokBiller} options={options} />
      <Navigator.Screen name="ToktokBillsFavorites" component={ToktokBillsFavorites} options={options} />
      <Navigator.Screen name="ToktokBillsHome" component={ToktokBillsHome} options={options} />
      <Navigator.Screen name="ToktokBillsPaymentSummary" component={ToktokBillsPaymentSummary} options={options} />
      <Navigator.Screen name="ToktokBillsPaymentProcess" component={ToktokBillsPaymentProcess} options={options} />

      {TransactionScreens({Navigator})}
    </>
  );
};
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
    // height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80)
  },
};
