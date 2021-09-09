import React, { createContext, useState } from 'react';
import { availableTips } from 'toktokfood/helper/strings';

export const VerifyContext = createContext()
const {Provider} = VerifyContext

export const VerifyContextProvider = ({children})=> {

    const [totalPrice, setTotalPrice] = useState(1);
    const [optionsAmount, setOptionsAmount] = useState(0);
    const [count, setCount] = useState({ type: '', quantity: 1 });
    const [selected, setSelected] = useState({});
    const [requiredOptions, setRequiredOptions] = useState({});
    const [notes, setNotes] = useState('');

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
          setRequiredOptions
        }}
      >
        {children}
      </Provider>
    )
}
