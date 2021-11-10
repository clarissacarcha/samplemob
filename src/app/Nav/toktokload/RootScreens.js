import React from 'react';
import {
  ToktokLoadContacts,
  ToktokLoadHome,
  ToktokLoadNetworks
} from 'toktokload/screens';
export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokLoadContacts" component={ToktokLoadContacts} options={{ headerTitleAlign: 'center' }} />
    <Navigator.Screen name="ToktokLoadHome" component={ToktokLoadHome} options={{ headerTitleAlign: 'center' }} />
    <Navigator.Screen name="ToktokLoadNetworks" component={ToktokLoadNetworks} options={{ headerTitleAlign: 'center' }} />
  </>
);
