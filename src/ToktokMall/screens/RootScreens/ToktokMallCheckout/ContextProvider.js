import React, {createContext,useState} from 'react'
import {useSelector} from 'react-redux'

export const CheckoutContext = createContext()
const {Provider} = CheckoutContext

export const CheckoutContextProvider = ({children})=> {

	const [shippingFeeRates, setShippingFeeRates] = useState([])
	const [unserviceableShipping, setUnserviceableShipping] = useState([])

	const [shippingVouchers, setShippingVouchers] = useState([])
	const [defaultVouchers, setDefaultVouchers] = useState([])

	return (
		<Provider 
			value={{
				shippingFeeRates,
				setShippingFeeRates,
				unserviceableShipping,
				setUnserviceableShipping,

				shippingVouchers,
				setShippingVouchers,
				defaultVouchers,
				setDefaultVouchers
			}}
		>
			{children}
		</Provider>
	)
	
}