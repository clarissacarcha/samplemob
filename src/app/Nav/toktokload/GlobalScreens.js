import React from 'react';
import {
  ToktokLoadContacts,
  ToktokLoadReceipt
} from 'toktokload/screens';
export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokLoadContacts" component={ToktokLoadContacts} options={{ headerTitleAlign: 'center' }} />
    <Navigator.Screen name="ToktokLoadReceipt" component={ToktokLoadReceipt} options={{ headerTitleAlign: 'center' }} />
  </>
);
