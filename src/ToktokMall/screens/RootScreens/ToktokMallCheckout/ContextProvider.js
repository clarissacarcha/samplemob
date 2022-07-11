import React, {createContext,useState} from 'react'
import {useSelector} from 'react-redux'

import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks'
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql'
import { GET_HASH_AMOUNT } from '../../../../graphql/toktokmall/model'
import { ArrayCopy } from '../../../helpers'
import AsyncStorage from '@react-native-community/async-storage'

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

	const [voucherRemoved, setVoucherRemoved] = useState(false)

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

	const getShopBranchId = (shopid) => {
		let res = 0
		shippingFeeRates.map((a) => a.shopid == shopid ? res = a.branchid : 0)
		return parseFloat(res)
	}

	const getShippingFeeByShopId = (shopid) => {
		let res = null
		shippingFeeRates.map((a) => a.shopid == shopid ? res = a.shippingfee : null)
		return parseFloat(res)
	}

	const getShopShippingDiscount = (shopid) => {
		let discount = null
		shippingVouchers.filter((a) => a.voucherCodeType == "shipping").map((a) => {
			if(a.shop_id == shopid){
				discount = a
			}
		})
		if(discount && discount?.valid) return discount.discountedAmount
		else return null
	}

	const getShopItemDiscount = (shopid) => {
		let discount = null
		shippingVouchers.filter((a) => a.voucherCodeType == "promotion").map((a) => {
			if(a?.shopid == shopid || a?.shop_id == shopid) discount = a
		})
		return discount
	}

	const getShopDiscountCount = (shopid) => {
		let v = shippingVouchers.filter((a) => a.appliedToShop == shopid)
		return v.length
	}

	const getVouchersApplied = (shopid, voucher) => {
		let v = shippingVouchers.filter((a) => a.voucher_id == voucher.voucher_id || a.vcode == voucher.vcode)
		return v.length
	}

	const getTotalItemDiscount = () => {
		let totalDeduction = 0
    shippingVouchers
    .filter((a) => {                
      return a.voucher_id != undefined || a.valid != undefined
    })
		.filter((a) => a.voucherCodeType == "promotion")
    .map((a) => {
			// a.deduction ? totalDeduction += a.deduction : totalDeduction += a.discount_totalamount 
			if(a.deduction){
				totalDeduction += parseFloat(a.deduction)
			}else if(a.discount_totalamount){
				totalDeduction += parseFloat(a.discount_totalamount)
			}else if(a.discount){
				totalDeduction += parseFloat(a.discount)
			}
		})
    return totalDeduction
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
				totalDeduction += parseFloat(a.deduction)
			}else if(a.discount_totalamount){
				totalDeduction += parseFloat(a.discount_totalamount)
			}else if(a.discount){
				totalDeduction += parseFloat(a.discount)
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

	const deleteVoucher = (voucher) => {
		setVoucherRemoved(true)
		let items = ArrayCopy(shippingVouchers)
		// console.log("DELETEION OF VOUCHERS REF", voucher)
		// console.log("DELETION OF VOUCHERS BEFORE", JSON.stringify(items))
		let newitems = items.filter((a) => !a?.autoShipping || !a?.autoAppy).filter((a) => a.voucher_code != voucher.voucher_code || a.vcode != voucher.vcode) //if match, remove from array
		// console.log("DELETION OF VOUCHERS AFTER", JSON.stringify(newitems))
		setShippingVouchers(newitems)
		setTimeout(() => {
			setVoucherRemoved(false)
		}, 100)
	}

	const getErrorMessageByCode = (code) => {
		switch(code) {
			case '001': 
				return ""
			case '002': 
				return ""
			case '003': 
				return ""
			case '004': 
				return "You have already redeemed this voucher."
			default: 
				return "Invalid voucher code."
		}
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

				getTotalItemDiscount,
				getTotalVoucherDeduction,
				getVoucherDeduction,

				getShopBranchId,
				getShippingFeeByShopId,
				getShopShippingDiscount,
				getShopItemDiscount,
				getShopDiscountCount,
				getVouchersApplied,

				voucherRemoved,
				setVoucherRemoved,
				deleteVoucher,

				getErrorMessageByCode
			}}
		>
			{children}
		</Provider>
	)
	
}