import React, {useState, useEffect,} from 'react';
import {CheckoutContextProvider} from './ContextProvider';
import { ToktokMallMyCartScreen } from './screen';

export const ToktokMallMyCart = ({route, navigation}) => {

  return (
    
    <>
      <CheckoutContextProvider>
        <ToktokMallMyCartScreen route={route} navigation={navigation} />
      </CheckoutContextProvider>
    </>
    
  );
};