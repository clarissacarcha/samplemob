import gql from 'graphql-tag'

export const GET_CUSTOMER_IF_EXIST = gql`
  query getCustomerIfExist($input: GetCustomerIfExistInput) {
		getCustomerIfExist(input: $input) {
			appSignature
			walletSignature
	    id
		  userId
    	firstName
    	lastName
			email
    	address1
    	addresses {
				id
     		address
      	landmark
      	defaultAdd
    	}
    }
  }
`

export const GET_CUSTOMER_ADDRESSES = gql`
	query getCustomerAddresses($input: GetCustomerAddressesInput) {
		getCustomerAddresses(input: $input) {
			id
  	  address
	    receiverName
    	receiverContact
      regionId
      provinceId
      municipalityId
			defaultAdd
			fullAddress
			latitude
			longitude
    	shippingSummary {
      	id
      	rateName
      	rateAmount
      	fromDay
      	toDay
      	deliveryDate
    	}
		}
	}
`

export const POST_CONTACT_SUPPORT = gql`
	mutation postContactSupport($input: PostContactSupportInput){
		postContactSupport(input: $input){
			success
			message
		}
	}
`