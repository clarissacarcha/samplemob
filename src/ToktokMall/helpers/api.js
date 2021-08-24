import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

export const env = "staging" // staging | production
export const paypanda_env = env == "staging" ? "sandbox" : "production"
export const api_url = {
	'staging': 'http://ec2-18-176-178-106.ap-northeast-1.compute.amazonaws.com/toktokmall/',
	'production': ''
}
export const paypanda_api_url = {
	'sandbox': 'https://sandbox.paypanda.ph/api/payment/transaction_entry',
	'production': ''
}

export const ApiCall = async (endpoint, body, debug = false) => {	

	let responseData = null
	let responseError = null

  try{

		let formData = new FormData()
		let rawSession = await AsyncStorage.getItem("ToktokMallUser")
		let session = JSON.parse(rawSession)

		//CHECK IF SESSION IS VALID
		if(session.appSignature){
			
			formData.append("signature", session.appSignature)
			formData.append("data", JSON.stringify(body))

			await axios.post(`${api_url[env]}${endpoint}`, formData).then((response) => {
				if(debug){
					console.log("Response data", response.data)
				}
				if(response.data.success == 1){
					responseData = response.data
				}else{
					responseError = response.data
				}
			}).catch((error) => {
				if(debug){
					console.log(error)
				}
			})

			return {
				responseData,
				responseError
			}

		}else{

			return {
				responseData,
				responseError
			}

		}

	}catch(error){
		console.log(error)
	}
}

export const PaypandaApiCall = async ({data, addressData}) => {
	let responseData = null
	let responseError = null
	try{
		let formData = new FormData()
		let rawSession = await AsyncStorage.getItem("ToktokMallUser")
		let session = JSON.parse(rawSession)

		formData.append("merchant_id", data.merchant_id)
		formData.append("reference_number", data.reference_number)
		formData.append("email_address", session.email)
		formData.append("payer_name", addressData.receiverName)
		formData.append("mobile_number", addressData.receiverContact)
		formData.append("amount_to_pay", data.amount_to_pay)
		formData.append("currency", "PHP")
		formData.append("remarks", "")
		formData.append("signature", data.signature)
		formData.append("longitude", "")
		formData.append("latitude", "")

		console.log("Paypanda Post Body", formData)

		await axios.post(paypanda_api_url[paypanda_env], formData).then((response) => {

			// console.log("Paypanda API Response", response.data)

			if(response.data){
				responseData = response.data
			}else{
				responseError = true
			}

		}).catch((error) => {
			if(debug){
				console.log(error)
			}
			responseError = error
		})

		return {
			responseData,
			responseError
		}

	}catch(error){
		console.log(error)
	}
}