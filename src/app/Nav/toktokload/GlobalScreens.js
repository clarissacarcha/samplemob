import React from 'react';
import {
  ToktokLoadContacts,
  ToktokLoadEnterPinCode,
  ToktokLoadReceipt,
  ToktokLoadTransactionLogs
} from 'toktokload/screens';
export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokLoadContacts" component={ToktokLoadContacts} options={{ headerTitleAlign: 'center' }} />
    <Navigator.Screen name="ToktokLoadEnterPinCode" component={ToktokLoadEnterPinCode} options={{ headerTitleAlign: 'center' }} />
    <Navigator.Screen name="ToktokLoadReceipt" component={ToktokLoadReceipt} options={{ headerTitleAlign: 'center' }} />
    <Navigator.Screen name="ToktokLoadTransactionLogs" component={ToktokLoadTransactionLogs} options={{ headerTitleAlign: 'center' }} />
  </>
);
