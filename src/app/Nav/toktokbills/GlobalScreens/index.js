import React from 'react';
import {
  ToktokBillsEnterOTP,
  ToktokBillsEnterTPIN
} from 'toktokbills/screens'

export default ({Navigator}) => {
  return (
    <>   
        <Navigator.Screen 
            name="ToktokBillsEnterOTP" 
            component={ToktokBillsEnterOTP}
            options={{
                headerTitleAlign: 'center' 
            }}
        />
       <Navigator.Screen 
            name="ToktokBillsEnterTPIN" 
            component={ToktokBillsEnterTPIN}
            options={{
                headerTitleAlign: 'center' 
            }}
       />
    </>
  );
};
