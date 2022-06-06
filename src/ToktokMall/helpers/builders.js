import AsyncStorage from '@react-native-community/async-storage';

export const BuildPostCheckoutBody = async ({
	walletRequest, 
	pin, 
	items, 
	addressData, 
	shippingRates, 
	grandTotal, 
	srpTotal,
	subTotal,
	paymentMethod, 
	vouchers,
	shippingVouchers,
	hashAmount,
	referenceNum,
	referral
}) => {
	console.log(parseFloat(subTotal))

	let rawsession = await AsyncStorage.getItem("ToktokMallUser")
	let session = JSON.parse(rawsession)

	if(session.userId){

		let orderType = GetOrderType(referral)

		return {
			name: addressData.receiverName,
			request_id: walletRequest.requestTakeMoneyId,
			pin: pin,
			pin_type: walletRequest.validator,
			contactnumber: addressData.receiverContact,
			email: session.email,
			address: addressData.address,
			regCode: addressData.regionId,
			provCode: addressData.provinceId || "0155",  //Pangasinan
			citymunCode: addressData.municipalityId,
			total_amount: parseFloat(subTotal),
			srp_totalamount: parseFloat(srpTotal),
			order_type: orderType,
			order_logs: BuildOrderLogsList({data: items, shipping: addressData.shippingSummary, shippingRates, shippingVouchers, orderType, vouchers}),
			//Optional values
			user_id: session.userId,
			notes: addressData.landmark || "",
			latitude: "",
			longitude: "",
			postalcode: "",
			account_type: 0,
			disrate: [],
			vouchers: vouchers,
			shippingvouchers: CheckShippingVouchers(shippingVouchers),
			referral_code: referral?.referralCode && referral?.referralCode != null ? referral?.referralCode : "",
			referral_account_type: referral?.franchiseeAccountType && referral?.franchiseeAccountType != null ? referral?.franchiseeAccountType : "",
			payment_method: paymentMethod,
			hash_amount: hashAmount,
			reference_num: referenceNum,
			orderRefNum: referenceNum,
			discounted_totalamount: orderType == 3 ? parseFloat(subTotal) : null			
		}
			
	}else{
		return {}
	}
	
}

export const BuildOrderLogsList = ({data, shipping, shippingRates, shippingVouchers, orderType, vouchers}) => {

	let logs = []
	data.map((val, index) => {

		let items = []
		if(val.data.length == 0 || val.data == undefined) return
		val.data[0].map((item, i) => {

			//HANDLE ITEM DISCOUNTS
			let discount = null
			vouchers.map((promo) => {
				promo?.items.map((itemwithpromo) => {
					if(itemwithpromo.product_id == item.product.Id){
						discount = itemwithpromo
					}
				})
			})

			console.log("ITEM DISCOUNT HANDLER", discount)
			
			let amount = discount ? discount.discounted_amount : item.product?.price

			let itemssubtotal = parseFloat(amount) * item.qty
			let itemssrptotal = parseFloat(item.product.price) * item.qty

			//PROMOTIONS
			let promo = {}

			if(item.product?.promotions && item.product?.promotions != null){
				promo.handle_product_promo = item.product?.promotions.lossPromo
				promo.promo_type = item.product?.promotions.promoType
				promo.promo_rate = item.product?.promotions.promoRate
				promo.promo_price = item.product?.promotions.promoPrice
				promo.promo_name = item.product?.promotions.name
			}

			items.push({
				sys_shop: val.shop.id,
				product_id: item.product.Id || item.id,
				itemname: item.product.itemname,
				quantity: item.qty,
				// amount: parseFloat(item.amount),
				// srp_amount: parseFloat(item.amount),
				// amount: item.product.price,
				amount: amount,
				srp_amount: item.product.price,
				srp_totalamount: itemssrptotal,
				total_amount: itemssubtotal,
				order_type: GetItemOrderType(orderType, promo),
				...promo
			})
		})

		let shippingfeeindex = shippingRates.findIndex((e) => e.shopid == val.shop.id)
		let vdiscountindex = shippingVouchers.findIndex((e) => e.shop_id == val.shop.id)
		let shippingFee = shippingRates[shippingfeeindex]
		let voucherDiscount = shippingVouchers[vdiscountindex]

		logs.push({
			sys_shop: val.shop.id,
			branchid: shippingFee.branchid,
			// delivery_amount: shipping.rateAmount,
			// delivery_amount: shippingVouchers[vdiscountindex] && shippingVouchers[vdiscountindex]?.discountedAmount != undefined ? shippingVouchers[vdiscountindex].discountedAmount : parseFloat(shippingRates[shippingfeeindex].shippingfee),
			delivery_amount: voucherDiscount && voucherDiscount?.discountedAmount != undefined ? voucherDiscount?.discountedAmount : parseFloat(shippingFee.shippingfee),
			original_shipping_fee: parseFloat(shippingFee.original_shipping),
			handle_shipping_promo: 1,
			hash: shippingFee.hash,
			// hash_delivery_amount:  shippingVouchers[vdiscountindex] && shippingVouchers[vdiscountindex]?.hash_delivery_amount != undefined ? shippingVouchers[vdiscountindex].hash_delivery_amount : shippingRates[shippingfeeindex].hash_price,
			hash_delivery_amount: voucherDiscount && voucherDiscount?.hash_delivery_amount != undefined ? voucherDiscount?.hash_delivery_amount : shippingFee.hash_price,
			daystoship: shipping.fromDay,
			daystoship_to: shipping.toDay,
			items: items
		})

	})

	return logs

}

export const BuildTransactionPayload = async ({method, notes, total, toktokid}) => {

	let rawsession = await AsyncStorage.getItem("ToktokMallUser")
	let session = JSON.parse(rawsession)

	console.log(session)

	if(session.userId){
		if(method == "TOKTOKWALLET"){
			return {
				name: `${session.firstName} ${session.lastName}`,
				currency: "PHP",
				amount: total,
				toktokuser_id: toktokid,
				payment_method: method,
				notes: notes
			}
		}
	}
}

export const CheckShippingVouchers = (data) => {
	if(data.length > 0){
		if(data[0].valid){
			return data
		}else{
			return []
		}
	}else{
		return []
	}
}

export const GetOrderType = (referral) => {
	if(referral && referral?.referralCode != null
		|| referral && referral?.franchiseeCode != null){
		//referral
		return 3
	}else{
		//regular
		return 2
	}
}

export const GetItemOrderType = (orderType, promotion) => {
	if(promotion?.promo_type) return 4
	switch(orderType) {
		case 1: return 1
		case 2: return 1
		case 3: return 2
		case 4: return 3
	}
}