import React from 'react';
import {
  ToktokBiller,
  ToktokBillsHome,
  ToktokBillsPaymentProcess,
  ToktokBillsPaymentSummary
} from 'toktokbills/screens'

export default ({Navigator}) => {
  return (
    <>   
      <Navigator.Screen 
        name="ToktokBiller" 
        component={ToktokBiller}
        options={{
          headerTitleAlign: 'center' 
        }}
      />
      <Navigator.Screen 
        name="ToktokBillsHome" 
        component={ToktokBillsHome}
        options={{
          headerTitleAlign: 'center' 
        }}
      />
      <Navigator.Screen 
        name="ToktokBillsPaymentProcess" 
        component={ToktokBillsPaymentProcess}
        options={{
          headerTitleAlign: 'center' 
        }}
      />
      <Navigator.Screen 
        name="ToktokBillsPaymentSummary" 
        component={ToktokBillsPaymentSummary}
        options={{
          headerTitleAlign: 'center' 
        }}
      />
    </>
  );
};
