import React, { createContext, useState } from 'react';
import { availableTips } from 'toktokfood/helper/strings';

export const VerifyContext = createContext()
const {Provider} = VerifyContext

export const VerifyContextProvider = ({children})=> {

  const [searchProduct, setSearchProduct] = useState('');
  const [foodCartHeight, setFoodCartHeight] = useState(0);
  const [navBartHeight, setNavBarHeight] = useState(0);
  const [temporaryCart, setTemporaryCart] = useState({
    cartItemsLength: 0,
    totalAmount: 0,
    items: []
  });

  return (
    <Provider
      value={{
        searchProduct,
        setSearchProduct,
        temporaryCart,
        setTemporaryCart,
        foodCartHeight,
        setFoodCartHeight,
        navBartHeight,
        setNavBarHeight
      }}
    >
      {children}
    </Provider>
  )
}
