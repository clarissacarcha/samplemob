import React, { createContext, useState } from 'react';
import { availableTips } from 'toktokfood/helper/strings';

export const VerifyContext = createContext()
const {Provider} = VerifyContext

export const VerifyContextProvider = ({children})=> {

  const [searchProduct, setSearchProduct] = useState('');
 
  return (
    <Provider
      value={{
        searchProduct,
        setSearchProduct
      }}
    >
      {children}
    </Provider>
  )
}
