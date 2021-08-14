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
    }
  }
`
