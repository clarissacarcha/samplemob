import gql from 'graphql-tag'

export const GET_CUSTOMER_IF_EXIST = gql`
  query getCustomerIfExist($input: GetCustomerIfExistInput) {
		getCustomerIfExist(input: $input) {
      id
    	firstName
    	lastName
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