import React from 'react';
import { Platform } from 'react-native';
import {
  ToktokLoadHome,
  ToktokLoadNetworks,
  ToktokLoadSummary,
} from 'toktokload/screens';
import { moderateScale } from "toktokload/helper";

export default ({Navigator}) => (
  <>
    <Navigator.Screen
      name="ToktokLoadHome"
      component={ToktokLoadHome}
      options={{
        headerTitleAlign: 'center',
        headerStyle: {
          elevation: 1,
          height: Platform.OS == 'ios' ? moderateScale(60) : moderateScale(80)
        },
      }}
    />
    <Navigator.Screen
      name="ToktokLoadNetworks"
      component={ToktokLoadNetworks}
      options={{
        headerTitleAlign: 'center',
        headerStyle: {
          elevation: 1,
          height: Platform.OS == 'ios' ? moderateScale(60) : moderateScale(80)
        },
      }}
    />
    <Navigator.Screen
      name="ToktokLoadSummary"
      component={ToktokLoadSummary}
      options={{
        headerTitleAlign: 'center',
        headerStyle: {
          elevation: 1,
          height: Platform.OS == 'ios' ? moderateScale(60) : moderateScale(80)
        },
      }}
    />
  </>
);
