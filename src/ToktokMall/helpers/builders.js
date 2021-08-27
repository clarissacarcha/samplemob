import AsyncStorage from '@react-native-community/async-storage';

export const BuildPostCheckoutBody = async ({items, addressData, grandTotal, paymentMethod, vouchers}) => {

	let rawsession = await AsyncStorage.getItem("ToktokMallUser")
	let session = JSON.parse(rawsession)

	if(session.userId){

		return {
			name: addressData.receiverName,
			contactnumber: addressData.receiverContact,
			email: session.email,
			address: addressData.address,
			regCode: addressData.regionId,
			provCode: addressData.provinceId || "0155",  //Pangasinan
			citymunCode: addressData.municipalityId,
			total_amount: parseFloat(grandTotal),
			srp_totalamount: parseFloat(grandTotal),
			order_type: 2,
			order_logs: BuildOrderLogsList({data: items, shipping: addressData.shippingSummary}),
			//Optional values
			user_id: session.userId,
			notes: "",
			latitude: "",
			longitude: "",
			postalcode: "",
			account_type: 0,
			vouchers: vouchers,
			referral_code: "",
			referral_account_type: "",
			payment_method: paymentMethod
		}
			
	}else{
		return {}
	}
	
}

export const BuildOrderLogsList = ({data, shipping}) => {

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
			daystoship: shipping.fromDay,
			daystoship_to: shipping.toDay,
			items: items
		})

	})

	return logs

}