import React, {createContext,useState} from 'react'
import {useSelector} from 'react-redux'

export const VerifyContext = createContext()
const {Provider} = VerifyContext

export const VerifyContextProvider = ({children})=> {

  const [toktokWallet, setToktokWallet] = useState(null);
  const [hasToktokWallet, setHasToktokWallet] = useState(false);
  
  return (
    <Provider
      value={{
        toktokWallet,
        setToktokWallet,
        hasToktokWallet,
        setHasToktokWallet
      }}
    >
      {children}
    </Provider>
  )
}
