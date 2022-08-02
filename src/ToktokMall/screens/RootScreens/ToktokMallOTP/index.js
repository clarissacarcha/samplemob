import React from 'react';

import { TPINOTPContextProvider } from './ContextProvider';
import {ToktokMallOTPScreen} from './screen';

export const ToktokMallOTP =  ({navigation, route}) => {

  return (
    <>
      <TPINOTPContextProvider>
        <ToktokMallOTPScreen route={route} navigation={navigation} />
      </TPINOTPContextProvider>
    </>
  )
  
}
