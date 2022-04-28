import React, {createContext, useState, useEffect} from 'react';
import {availableTips} from 'toktokfood/helper/strings';
import {useRoute} from '@react-navigation/native';

export const VerifyContext = createContext();
const {Provider} = VerifyContext;

export const VerifyContextProvider = ({children}) => {

  const routes = useRoute();

  const [totalPrice, setTotalPrice] = useState(0);
  const [optionsAmount, setOptionsAmount] = useState(0);
  const [count, setCount] = useState({type: '', quantity: 1});
  const [selected, setSelected] = useState({});
  const [requiredOptions, setRequiredOptions] = useState({});
  const [notes, setNotes] = useState('');
  const [productDetails, setProductDetails] = useState({});
  const [temporaryCart, setTemporaryCart] = useState({
    totalAmount: 0,
    items: []
  });
  const [hasTemporaryCart, setHasTemporaryCart] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [basePrice, setBasePrice] = useState(0);
  const [orderInstructions, setOrderInstructions] = useState('Remove or edit unavailable item');

  return (
    <Provider
      value={{
        totalPrice,
        setTotalPrice,
        optionsAmount,
        setOptionsAmount,
        count,
        setCount,
        selected,
        setSelected,
        requiredOptions,
        setRequiredOptions,
        notes,
        setNotes,
        productDetails,
        setProductDetails,
        temporaryCart,
        setTemporaryCart,
        hasTemporaryCart,
        setHasTemporaryCart,
        selectedVariants,
        setSelectedVariants,
        basePrice,
        setBasePrice,
        orderInstructions,
        setOrderInstructions,
      }}
    >
      {children}
    </Provider>
  )
}
