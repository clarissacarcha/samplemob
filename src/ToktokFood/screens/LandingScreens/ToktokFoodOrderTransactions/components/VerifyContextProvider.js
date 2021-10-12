import React, {createContext, useState, useEffect} from 'react';
import {availableTips} from 'toktokfood/helper/strings';
import {useRoute} from '@react-navigation/native';

export const VerifyContext = createContext();
const {Provider} = VerifyContext;

export const VerifyContextProvider = ({children}) => {

  const routes = useRoute();
 
  const [focusTab, setFocusTab] = useState(1);
  const [transactionList, setTransactionList] = useState(null);

  useEffect(() => {
    if(routes.params?.tab != undefined){
      setFocusTab(routes.params.tab)
    }
  }, [routes.params])

  return (
    <Provider
      value={{
        focusTab,
        setFocusTab,
        transactionList,
        setTransactionList
      }}
    >
      {children}
    </Provider>
  )
}
