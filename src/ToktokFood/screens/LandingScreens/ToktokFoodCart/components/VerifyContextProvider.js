import React, {createContext, useState, useEffect} from 'react';
import {availableTips} from 'toktokfood/helper/strings';
import {useRoute} from '@react-navigation/native';
import { getTemporaryCart } from 'toktokfood/helper/TemporaryCart';

export const VerifyContext = createContext();
const {Provider} = VerifyContext;

export const VerifyContextProvider = ({children}) => {

  const routes = useRoute();

  const [totalAmount, setTotalAmount] = useState(0);
  const [tempCart, setTempCart] = useState([]);

  useEffect(() => {
    async function handleGetTemporaryCart() {
      let { cart, totalAmount } = await getTemporaryCart()
      setTempCart(cart)
      setTotalAmount(totalAmount[cart[0]['sys_shop']])
    }
    handleGetTemporaryCart()
  }, [])

  return (
    <Provider
      value={{
        totalAmount,
        setTotalAmount,
        tempCart,
        setTempCart
      }}
    >
      {children}
    </Provider>
  )
}
