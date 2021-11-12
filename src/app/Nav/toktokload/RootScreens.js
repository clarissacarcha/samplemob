import React from 'react';
import {
  ToktokLoadContacts,
  ToktokLoadHome,
  ToktokLoadNetworks,
  ToktokLoadSummary,
  ToktokLoadReceipt
} from 'toktokload/screens';
export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokLoadContacts" component={ToktokLoadContacts} options={{ headerTitleAlign: 'center' }} />
    <Navigator.Screen name="ToktokLoadHome" component={ToktokLoadHome} options={{ headerTitleAlign: 'center' }} />
    <Navigator.Screen name="ToktokLoadNetworks" component={ToktokLoadNetworks} options={{ headerTitleAlign: 'center' }} />
    <Navigator.Screen name="ToktokLoadSummary" component={ToktokLoadSummary} options={{ headerTitleAlign: 'center' }} />
    <Navigator.Screen name="ToktokLoadReceipt" component={ToktokLoadReceipt} options={{ headerTitleAlign: 'center' }} />
  </>
);
