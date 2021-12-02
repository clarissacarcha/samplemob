import gql from 'graphql-tag'

export const GET_CHECKOUT_DATA = gql`
  query getCheckoutData($input: GetCheckoutDataInput) {
		getCheckoutData(input: $input) {
      address {
				id
				address
				receiverName
				receiverContact
				regionId
				provinceId
				municipalityId     
				fullAddress 
				shippingSummary {
					id
					rateName
					rateAmount
					fromDay
					toDay
					deliveryDate
				}
			}
			vouchers {
				id
				vcode
			}
			paymentMethods {
				id
				paycode
				description
			}
			shippingRates {
				signature
      	date_today
      	shopid
      	des_lat
      	des_lng
      	origin_lat
      	origin_lng
			}
			shippingRatePayload
			cartrawdata
			autoShippingPayload
    }
  }
`

export const GET_HASH_AMOUNT = gql`
	query getHashDeliveryAmount($input: GetHashDeliveryAmountInput) {
		getHashDeliveryAmount(input: $input) {
			hash
			index
			value
		}
	}
`

export const POST_CHECKOUT = gql`
	mutation postCheckout($input: PostCheckoutInput) {
		postCheckout(input: $input){
			success
			message
			orderId
			orderReferenceNum
		}
	}
`