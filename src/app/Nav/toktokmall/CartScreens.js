import React from 'react';
import {
  ToktokMallMyCart
} from '../../../ToktokMall/screens';

export default ({Navigator}) => {
  return (
    <>
      <Navigator.Screen name="ToktokMallMyCart" component={ToktokMallMyCart} />
    </>
  )
};
