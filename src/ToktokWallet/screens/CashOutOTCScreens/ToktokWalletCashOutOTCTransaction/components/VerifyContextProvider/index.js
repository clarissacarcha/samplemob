import React, {createContext, useState} from 'react';
import {useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';

export const VerifyContext = createContext();
const {Provider} = VerifyContext;

export const VerifyContextProvider = ({children}) => {
  const route = useRoute();

  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [firstField, setFirstField] = useState('');
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [secondField, setSecondField] = useState('');
  const [dateOfClaim, setDateOfClaim] = useState('');
  const [dateOfClaimError, setDateOfClaimError] = useState('');
  const [purpose, setPurpose] = useState('');
  const [providerServiceFee, setProviderServiceFee] = useState(0);

  const changeErrorMessages = (key, value) => {
    setPerson(oldstate => ({
      ...oldstate,
      [key]: value,
    }));
  };

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
        isInsufficientBalance,
        setIsInsufficientBalance,
        secondField,
        setSecondField,
        dateOfClaim,
        setDateOfClaim,
        setDateOfClaimError,
        dateOfClaimError,
        purpose,
        setPurpose,
        providerServiceFee,
        setProviderServiceFee,
      }}>
      {children}
    </Provider>
  );
};
