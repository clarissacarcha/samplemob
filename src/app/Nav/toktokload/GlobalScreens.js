import React from "react";
import { Platform } from "react-native";
import {
  ToktokLoadContacts,
  ToktokLoadEnterPinCode,
  ToktokLoadReceipt,
  ToktokLoadTermsAndConditions,
  ToktokLoadTransactionLogs
} from "toktokload/screens";
import { moderateScale } from "toktokload/helper";

export default ({Navigator}) => (
  <>
    <Navigator.Screen
      name="ToktokLoadContacts"
      component={ToktokLoadContacts}
      options={{
        headerTitleAlign: "center",
        headerStyle: {
          elevation: 1,
          height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80)
        },
      }}
    />
    <Navigator.Screen
      name="ToktokLoadEnterPinCode"
      component={ToktokLoadEnterPinCode}
      options={{
        headerTitleAlign: "center",
        headerStyle: {
          elevation: 1,
          height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80)
        },
      }}
    />
    <Navigator.Screen
      name="ToktokLoadReceipt"
      component={ToktokLoadReceipt}
      options={{
        headerTitleAlign: "center",
        headerStyle: {
          elevation: 1,
          height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80)
        },
      }}
    />
    <Navigator.Screen
      name="ToktokLoadTermsAndConditions"
      component={ToktokLoadTermsAndConditions}
      options={{
        headerTitleAlign: "center",
        headerStyle: {
          elevation: 1,
          height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80)
        },
      }}
    />
    <Navigator.Screen
      name="ToktokLoadTransactionLogs"
      component={ToktokLoadTransactionLogs}
      options={{
        headerTitleAlign: "center",
        headerStyle: {
          elevation: 1,
          height: Platform.OS == "ios" ? moderateScale(60) : moderateScale(80)
        },
      }}
    />
  </>
);
