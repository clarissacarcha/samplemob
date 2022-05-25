import React, {createContext, useState} from 'react';
import {useSelector} from 'react-redux';

export const VerifyContext = createContext();
const {Provider} = VerifyContext;

export const VerifyContextProvider = ({children}) => {
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [firstField, setFirstField] = useState('');
  const [firstFieldError, setFirstFieldError] = useState('');
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [secondField, setSecondField] = useState('');
  const [secondFieldError, setSecondFieldError] = useState('');

  return (
    <Provider
      value={{
        amount,
        setAmount,
        amountError,
        setAmountError,
        email,
        setEmail,
        emailError,
        setEmailError,
        firstField,
        setFirstField,
        firstFieldError,
        setFirstFieldError,
        isInsufficientBalance,
        setIsInsufficientBalance,
        secondField,
        setSecondField,
        secondFieldError,
        setSecondFieldError,
      }}>
      {children}
    </Provider>
  );
};
