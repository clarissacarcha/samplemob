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
	const [voucherErrors, setVoucherErrors] = useState([])

	const [autoShippingPayload, setAutoShippingPayload] = useState({})

	const [unavailableItems, setUnavailableItems] = useState([])

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

	const getShippingFeeByShopId = (shopid) => {
		let res = null
		shippingFeeRates.map((a) => a.shopid == shopid ? res = a.shippingfee : null)
		return parseFloat(res)
	}

	const getTotalVoucherDeduction = () => {
    let totalDeduction = 0
    shippingVouchers
    .filter((a) => {                
      return a.voucher_id != undefined || a.valid != undefined
    })
    .map((a) => {
			// a.deduction ? totalDeduction += a.deduction : totalDeduction += a.discount_totalamount 
			if(a.deduction){
				totalDeduction += a.deduction
			}else if(a.discount_totalamount){
				totalDeduction += a.discount_totalamount
			}else if(a.discount){
				totalDeduction += a.discount
			}
		})
    return totalDeduction
  }

	const getVoucherDeduction = (voucher) => {
		// if(voucher.deduction) return voucher.deduction
		// else if(voucher.discount_totalamount) return voucher.discount_totalamount
		// else if(voucher.discount) return voucher.discount
		return voucher?.deduction || voucher?.discount_totalamount || voucher?.discount
	}

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
				hashDeliveryData: data,

				voucherErrors,
				setVoucherErrors,

				unavailableItems,
				setUnavailableItems,

				getTotalVoucherDeduction,
				getVoucherDeduction,

				getShippingFeeByShopId
			}}
		>
			{children}
		</Provider>
	)
	
}