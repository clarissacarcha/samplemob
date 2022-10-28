import React, {createContext,useState, useRef} from 'react'
import {useSelector} from 'react-redux'
import { Animated } from "react-native"

import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks'
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql'
import { GET_HASH_AMOUNT } from '../../../../graphql/toktokmall/model'
import { ArrayCopy } from '../../../helpers'
import AsyncStorage from '@react-native-community/async-storage'

export const CheckoutContext = createContext()
const {Provider} = CheckoutContext

export const CheckoutContextProvider = ({children})=> {

	//ANIMATIONS
	const [animatePayments, setAnimatePayments] = useState(false)

	const [shippingFeeRates, setShippingFeeRates] = useState([])
	const [unserviceableShipping, setUnserviceableShipping] = useState([])

	const [shippingVouchers, setShippingVouchers] = useState([])
	
	const [defaultVouchers, setDefaultVouchers] = useState([])
	const [voucherErrors, setVoucherErrors] = useState([])

	const [autoShippingPayload, setAutoShippingPayload] = useState({})

	const [unavailableItems, setUnavailableItems] = useState([])

	const [voucherRemoved, setVoucherRemoved] = useState(false)

	const [resellerDiscounts, setResellerDiscounts] = useState(0)

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

	const getShopItemDiscount = (shopid, productId) => {
		let discount = null
		shippingVouchers.filter((a) => a.voucherCodeType == "promotion").map((a) => {
			if(a?.shopid == shopid && a?.appliedToShop == shopid || a?.shop_id == shopid && a?.appliedToShop == shopid){
				discount = a
			}else if(a?.shopid == 0 || a?.shop_id == 0){
				let discountedItems = a.product_id?.split(",")
				discountedItems.map((discountedItem) => {
					if(discountedItem == productId && a?.appliedToShop == shopid){
						discount = a
					}
				})
			}
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

	const computeTotalResellerDiscount = (data) => {
		let discountsLog = []
		let resellerDiscount = 0
		data.map((items) => {
			items.data[0].map((item, index) => {
				
				let shopDiscount = getShopItemDiscount(item.shopId, item.product.Id)
				// console.log("shop discount", shopDiscount, item.shopId, item)
				if(shopDiscount){
					if(item.qty > 1){
						let itemsrpprice = parseFloat(item.product.compareAtPrice * (item.qty - 1))
						let discountedprice = parseFloat(item.product.price * (item.qty - 1))
						resellerDiscount += itemsrpprice - discountedprice
						discountsLog.push(itemsrpprice - discountedprice)
					}				
				}else{
					let itemsrpprice = parseFloat(item.product.compareAtPrice * item.qty)
					let discountedprice = parseFloat(item.product.price * item.qty)
					resellerDiscount += itemsrpprice - discountedprice
					discountsLog.push(itemsrpprice - discountedprice)
				}

				// console.log("Shop Reseller Discount", resellerDiscount)
				
			})
		})
		console.log("Reseller discounts logs", discountsLog)
		setResellerDiscounts(resellerDiscount)
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
				return "This voucher has reached the redemption limit."
			default: 
				return "Invalid voucher code."
		}
	}

	return (
		<Provider 
			value={{

				animatePayments,
				setAnimatePayments,
				
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

				resellerDiscounts,
				setResellerDiscounts,

				getTotalItemDiscount,
				getTotalVoucherDeduction,
				getVoucherDeduction,

				getShopBranchId,
				getShippingFeeByShopId,
				getShopShippingDiscount,
				getShopItemDiscount,
				getShopDiscountCount,
				getVouchersApplied,

				computeTotalResellerDiscount,

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