import React from 'react';
import {
  ToktokBiller,
  ToktokBillsHome,
  ToktokBillsPaymentProcess,
  ToktokBillsPaymentSummary
} from 'toktokbills/screens';
import { Platform } from 'react-native';
import { moderateScale } from "toktokload/helper";

export default ({Navigator}) => {
  return (
    <>   
      <Navigator.Screen 
        name="ToktokBiller" 
        component={ToktokBiller}
        options={{
          headerTitleAlign: "center",
          headerStyle: {
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80)
          },
        }}
      />
      <Navigator.Screen 
        name="ToktokBillsHome" 
        component={ToktokBillsHome}
        options={{
          headerTitleAlign: "center",
          headerStyle: {
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80)
          },
        }}
      />
      <Navigator.Screen 
        name="ToktokBillsPaymentProcess" 
        component={ToktokBillsPaymentProcess}
        options={{
          headerTitleAlign: "center",
          headerStyle: {
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80)
          },
        }}
      />
      <Navigator.Screen 
        name="ToktokBillsPaymentSummary" 
        component={ToktokBillsPaymentSummary}
        options={{
          headerTitleAlign: "center",
          headerStyle: {
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80)
          },
        }}
      />
    </>
  );
};
