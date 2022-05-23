import React, {createContext, useState} from 'react';
import {useSelector} from 'react-redux';

export const VerifyContext = createContext();
const {Provider} = VerifyContext;

export const VerifyContextProvider = ({children}) => {
  const [firstField, setFirstField] = useState('');
  const [firstFieldError, setFirstFieldError] = useState('');
  const [secondField, setSecondField] = useState('');
  const [secondFieldError, setSecondFieldError] = useState('');
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [amountError, setAmountError] = useState('');

  return (
    <Provider
      value={{
        firstField,
        setFirstField,
        firstFieldError,
        setFirstFieldError,
        secondField,
        setSecondField,
        secondFieldError,
        setSecondFieldError,
        amount,
        setAmount,
        email,
        setEmail,
        emailError,
        setEmailError,
        amountError,
        setAmountError,
      }}>
      {children}
    </Provider>
  );
};
