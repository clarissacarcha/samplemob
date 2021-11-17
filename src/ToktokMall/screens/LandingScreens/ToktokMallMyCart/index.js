import React, {useState, useEffect,} from 'react';
import { CartContextProvider } from './ContextProvider';
import { ToktokMallMyCartScreen } from './screen';

export const ToktokMallMyCart = ({route, navigation}) => {

  return (
    
    <>
      <CartContextProvider>
        <ToktokMallMyCartScreen route={route} navigation={navigation} />
      </CartContextProvider>
    </>
    
  );
};