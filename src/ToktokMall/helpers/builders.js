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
	referenceNum
}) => {
	console.log(parseFloat(subTotal))

	let rawsession = await AsyncStorage.getItem("ToktokMallUser")
	let session = JSON.parse(rawsession)

	if(session.userId){

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
			order_type: 2,
			order_logs: BuildOrderLogsList({data: items, shipping: addressData.shippingSummary, shippingRates, shippingVouchers}),
			//Optional values
			user_id: session.userId,
			notes: "This is a test order from mobile",
			latitude: "",
			longitude: "",
			postalcode: "",
			account_type: 0,
			disrate: [],
			vouchers: vouchers,
			shippingvouchers: shippingVouchers,
			referral_code: "",
			referral_account_type: "",
			payment_method: paymentMethod,
			hash_amount: hashAmount,
			reference_num: referenceNum,
			orderRefNum: referenceNum
		}
			
	}else{
		return {}
	}
	
}

export const BuildOrderLogsList = ({data, shipping, shippingRates, shippingVouchers}) => {

	let logs = []
	data.map((val, index) => {

		let items = []
		if(val.data.length == 0 || val.data == undefined) return
		val.data[0].map((item, i) => {
			let total = parseFloat(item.amount) * item.qty

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
				product_id: item.product.Id,
				itemname: item.product.itemname,
				quantity: item.qty,
				amount: parseFloat(item.amount),
				srp_amount: parseFloat(item.amount),
				srp_totalamount: total,
				total_amount: total,
				order_type: 2,
				...promo
			})
		})

		let shippingfeeindex = shippingRates.findIndex((e) => e.shopid == val.shop.id)

		logs.push({
			sys_shop: val.shop.id,
			branchid: shippingRates[shippingfeeindex].branchid,
			// delivery_amount: shipping.rateAmount,
			delivery_amount: shippingVouchers[index] ? shippingVouchers[index].discount : parseFloat(shippingRates[shippingfeeindex].shippingfee),
			original_shipping_fee: parseFloat(shippingRates[shippingfeeindex].original_shipping),
			handle_shipping_promo: 1,
			hash: shippingRates[shippingfeeindex].hash,
			hash_delivery_amount:  shippingVouchers[index] ? shippingVouchers[index].hash_delivery_amount : shippingRates[shippingfeeindex].hash_price,
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