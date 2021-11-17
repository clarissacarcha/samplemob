import React, {createContext,useState} from 'react'
import {useSelector} from 'react-redux'

export const VerifyContext = createContext()
const {Provider} = VerifyContext

export const VerifyContextProvider = ({children})=> {

  const [accountNo, setAccountNo] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [accountNoError, setAccountNoError] = useState("");
  const [amountError, setAmountError] = useState("");

  return (
    <Provider
      value={{
        accountNo,
        setAccountNo,
        accountName,
        setAccountName,
        amount,
        setAmount,
        email,
        setEmail,
        emailError,
        setEmailError,
        accountNoError,
        setAccountNoError,
        amountError,
        setAmountError
      }}
    >
      {children}
    </Provider>
  )
}
