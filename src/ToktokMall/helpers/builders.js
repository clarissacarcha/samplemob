import AsyncStorage from '@react-native-community/async-storage';

export const BuildPostCheckoutBody = async ({
	walletRequest, 
	pin, 
	items, 
	addressData, 
	shippingRates, 
	grandTotal, 
	subTotal,
	paymentMethod, 
	vouchers,
	hashAmount,
	referenceNum
}) => {

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
			srp_totalamount: parseFloat(subTotal),
			order_type: 2,
			order_logs: BuildOrderLogsList({data: items, shipping: addressData.shippingSummary, shippingRates}),
			//Optional values
			user_id: session.userId,
			notes: "This is a test order from mobile",
			latitude: "",
			longitude: "",
			postalcode: "",
			account_type: 0,
			disrate: [],
			vouchers: vouchers,
			shippingvouchers: [],
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

export const BuildOrderLogsList = ({data, shipping, shippingRates}) => {

	let logs = []
	data.map((val, index) => {

		let items = []
		if(val.data.length == 0 || val.data == undefined) return
		val.data[0].map((item, i) => {
			let total = parseFloat(item.amount) * item.qty
			items.push({
				sys_shop: val.shop.id,
				product_id: item.product.Id,
				itemname: item.product.itemname,
				quantity: item.qty,
				amount: parseFloat(item.amount),
				srp_amount: parseFloat(item.amount),
				srp_totalamount: total,
				total_amount: total,
				order_type: 2
			})
		})

		logs.push({
			sys_shop: val.shop.id,
			branchid: 0,
			// delivery_amount: shipping.rateAmount,
			delivery_amount: parseFloat(shippingRates[index].price),
			original_shipping_fee: parseFloat(shippingRates[index].price),
			handle_shipping_promo: 1,
			hash: shippingRates[index].hash,
			hash_delivery_amount: shippingRates[index].hash_price,
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