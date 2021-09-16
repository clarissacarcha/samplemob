import AsyncStorage from '@react-native-community/async-storage';

export const BuildPostCheckoutBody = async ({walletRequest, pin, items, addressData, shippingRates, grandTotal, paymentMethod, vouchers}) => {

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
			total_amount: parseFloat(grandTotal),
			srp_totalamount: parseFloat(grandTotal),
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
			referral_code: "",
			referral_account_type: "",
			payment_method: paymentMethod
		}
			
	}else{
		return {}
	}
	
}

export const BuildOrderLogsList = ({data, shipping, shippingRates}) => {

	let logs = []
	data.map((val, index) => {

		let items = []
		if(val.cart.length == 0 || val.cart == undefined) return
		val.cart.map((item, i) => {
			let total = parseFloat(item.price) * item.qty
			items.push({
				sys_shop: item.store_id,
				product_id: item.item_id,
				quantity: item.qty,
				amount: parseFloat(item.price),
				srp_amount: parseFloat(item.price),
				srp_totalamount: total,
				total_amount: total,
				order_type: 2
			})
		})

		logs.push({
			sys_shop: val.store_id,
			branchid: 0,
			delivery_amount: shipping.rateAmount,
			hash: shippingRates[index].hash,
			hash_delivery_amount: shippingRates[index].price,
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