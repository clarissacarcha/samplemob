import React from 'react';
import {
  ToktokLoadHome,
  ToktokLoadNetworks,
  ToktokLoadSummary,
} from 'toktokload/screens';
export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokLoadHome" component={ToktokLoadHome} options={{ headerTitleAlign: 'center' }} />
    <Navigator.Screen name="ToktokLoadNetworks" component={ToktokLoadNetworks} options={{ headerTitleAlign: 'center' }} />
    <Navigator.Screen name="ToktokLoadSummary" component={ToktokLoadSummary} options={{ headerTitleAlign: 'center' }} />
  </>
);
