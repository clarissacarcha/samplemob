import React, {createContext, useState} from 'react';
import {useSelector} from 'react-redux';

export const VerifyContext = createContext();
const {Provider} = VerifyContext;

export const VerifyContextProvider = ({children}) => {
  const session = useSelector(state => state.session);

  const [qrOptions, setQrOptions] = useState('Scan');

  return <Provider value={{qrOptions, setQrOptions}}>{children}</Provider>;
};
