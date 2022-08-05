import React from 'react';
import {ToktokBillsMaintenance, ToktokBillsOnboarding, ToktokBillsSplashScreen} from 'toktokbills/screens';
import {Platform} from 'react-native';
import {moderateScale} from 'toktokbills/helper';

export default ({Navigator}) => {
  return (
    <>
      <Navigator.Screen
        name="ToktokBillsMaintenance"
        component={ToktokBillsMaintenance}
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
      />
    </>
  );
};
