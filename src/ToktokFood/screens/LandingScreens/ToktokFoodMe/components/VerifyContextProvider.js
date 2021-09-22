import React, {createContext, useState, useEffect} from 'react';
import {availableTips} from 'toktokfood/helper/strings';
import {useRoute} from '@react-navigation/native';

export const VerifyContext = createContext();
const {Provider} = VerifyContext;

export const VerifyContextProvider = ({children}) => {

  const routes = useRoute();

  const [showHelpCentreList, setShowHelpCentreList] = useState(false);

  return (
    <Provider
      value={{
        showHelpCentreList,
        setShowHelpCentreList
      }}
    >
      {children}
    </Provider>
  )
}
