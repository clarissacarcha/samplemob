import gql from 'graphql-tag'

export const GET_CITIES = gql`
	query getCities {
		getCities {
            id
            citymunDesc
            citymunCode
            provCode
            regDesc
        }
	}
`
export const GET_CITY = gql`
	query getCity($input: getCityInput) {
		getCity(input: $input) {
            id
            citymunDesc
            citymunCode
            provCode
            regDesc
        }
	}
`

export const GET_DEFAULT_ADDRESS = gql`
  query getDefaultCustomerAddress($input: GetDefaultCustomerAddressInput) {
		getDefaultCustomerAddress(input: $input) {
			id
			fullAddress
			
		}
	}
`