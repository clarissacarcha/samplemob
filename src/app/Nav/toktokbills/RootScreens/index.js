import React from 'react';
import {
  ToktokBiller,
  ToktokBillsHome
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
    </>
  );
};
