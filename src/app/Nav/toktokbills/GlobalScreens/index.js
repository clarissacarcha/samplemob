import React from 'react';
import {
  ToktokBillsActivityDetails,
  ToktokBillsEnterPinCode,
  ToktokBillsReceipt,
  ToktokBillsTermsAndConditions,
  ToktokBillsTransactionLogs
} from 'toktokbills/screens';
import { Platform } from 'react-native';
import { moderateScale } from "toktokbills/helper";

export default ({Navigator}) => {
  return (
    <>   
      <Navigator.Screen 
        name="ToktokBillsActivityDetails" 
        component={ToktokBillsActivityDetails}
        options={{
          headerTitleAlign: "center",
          headerStyle: {
            shadowColor: "#000",
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
        name="ToktokBillsEnterPinCode" 
        component={ToktokBillsEnterPinCode}
        options={{
          headerTitleAlign: "center",
          headerStyle: {
            shadowColor: "#000",
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
        name="ToktokBillsReceipt" 
        component={ToktokBillsReceipt}
        options={{
          headerTitleAlign: "center",
          headerStyle: {
            shadowColor: "#000",
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
        name="ToktokBillsTermsAndConditions" 
        component={ToktokBillsTermsAndConditions}
        options={{
          headerTitleAlign: "center",
          headerStyle: {
            shadowColor: "#000",
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
        name="ToktokBillsTransactionLogs" 
        component={ToktokBillsTransactionLogs}
        options={{
          headerTitleAlign: "center",
          headerStyle: {
            shadowColor: "#000",
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
