import React from 'react';
import {
  ToktokBillsEnterPinCode,
  ToktokBillsReceipt,
  ToktokBillsTransactionLogs
} from 'toktokbills/screens'

export default ({Navigator}) => {
  return (
    <>   
      <Navigator.Screen 
        name="ToktokBillsEnterPinCode" 
        component={ToktokBillsEnterPinCode}
        options={{
          headerTitleAlign: 'center' 
        }}
      />
      <Navigator.Screen 
        name="ToktokBillsReceipt" 
        component={ToktokBillsReceipt}
        options={{
          headerTitleAlign: 'center' 
        }}
      />
      <Navigator.Screen 
        name="ToktokBillsTransactionLogs" 
        component={ToktokBillsTransactionLogs}
        options={{
          headerTitleAlign: 'center' 
        }}
      />
    </>
  );
};
