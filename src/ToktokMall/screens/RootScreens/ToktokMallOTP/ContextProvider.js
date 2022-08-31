import AsyncStorage from '@react-native-community/async-storage'
import React, {createContext,useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

export const TPINOTPContext = createContext()
const {Provider} = TPINOTPContext

export const TPINOTPContextProvider = ({children})=> {

	const session = useSelector(state => state.session)
  const [value, setValue] = useState("")
  const [retries, setretries] = useState(3)
  const [isInvalid, setIsInvalid] = useState(false)
  const [lockMessage, setlockMessage] = useState("We're sorry but you dont have any attempts left, Please wait for 30 minutes to request an OTP again. Thank you!")
  const [timeRemaining, setTimeRemaining] = useState(30)

	return (
		<Provider 
			value={{
				session,
				value,
				setValue,

				retries,
				setretries,

				isInvalid,
				setIsInvalid,

				lockMessage,
				setlockMessage,

				timeRemaining,
				setTimeRemaining
			}}
		>
			{children}
		</Provider>
	)
	
}