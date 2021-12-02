import React, {createContext,useState} from 'react'
import {useSelector} from 'react-redux'

import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks'
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql'
import { GET_HASH_AMOUNT } from '../../../../graphql/toktokmall/model'

export const CheckoutContext = createContext()
const {Provider} = CheckoutContext

export const CheckoutContextProvider = ({children})=> {

	const [shippingFeeRates, setShippingFeeRates] = useState([])
	const [unserviceableShipping, setUnserviceableShipping] = useState([])

	const [shippingVouchers, setShippingVouchers] = useState([])
	const [defaultVouchers, setDefaultVouchers] = useState([])

	const [autoShippingPayload, setAutoShippingPayload] = useState({})

	const [getShippingHashDeliveryAmount, {data}] = useLazyQuery(GET_HASH_AMOUNT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      if(response.getHashDeliveryAmount){
        return response.getHashDeliveryAmount
      }else{
				return false
			}
    },
    onError: (err) => {
      console.log(err)
    }
  })

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
				setDefaultVouchers,

				autoShippingPayload,
				setAutoShippingPayload,

				getShippingHashDeliveryAmount,
				hashDeliveryData: data
			}}
		>
			{children}
		</Provider>
	)
	
}