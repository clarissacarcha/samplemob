import React from 'react';
import {
  ToktokBiller,
  ToktokBillsHome,
  ToktokBillsOnboarding,
  ToktokBillsPaymentProcess,
  ToktokBillsPaymentSummary,
  // ToktokBillsSplashScreen,
} from 'toktokbills/screens';
import {Platform} from 'react-native';
import {moderateScale} from 'toktokbills/helper';

export default ({Navigator}) => {
  return (
    <>
      <Navigator.Screen
        name="ToktokBiller"
        component={ToktokBiller}
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
            // height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80)
          },
        }}
      />
      <Navigator.Screen
        name="ToktokBillsHome"
        component={ToktokBillsHome}
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
            // height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80)
          },
        }}
      />
      <Navigator.Screen
        name="ToktokBillsOnboarding"
        component={ToktokBillsOnboarding}
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
            // height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80)
          },
        }}
      />
      <Navigator.Screen
        name="ToktokBillsPaymentProcess"
        component={ToktokBillsPaymentProcess}
        options={{
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
        }}
      />
      <Navigator.Screen
        name="ToktokBillsPaymentSummary"
        component={ToktokBillsPaymentSummary}
        options={{
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
        }}
      />
      {/* <Navigator.Screen
        name="ToktokBillsSplashScreen"
        component={ToktokBillsSplashScreen}
        options={{
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
        }}
      /> */}
    </>
  );
};
