import gql from 'graphql-tag'

export const GET_CUSTOMER_IF_EXIST = gql`
  query getCustomerIfExist($input: GetCustomerIfExistInput) {
		getCustomerIfExist(input: $input) {
			appSignature
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