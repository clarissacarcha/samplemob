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
            provDesc
            provCode
            regCode
            regDesc
            coordinates {
              lon
              lat
            }
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

export const GET_CUSTOMER_ADDRESS_DETAILS = gql`
  query getCustomerAddressDetails($input: GetAddressDetailsInput) {
    getCustomerAddressDetails(input: $input) {
      id
      receiverName
      receiverContact
      address
      landmark
      postalCode
      regionId
      provinceId
      municipalityId
      brgyId
      latitude
      longitude
      defaultAdd      
    }
  }
`


export const GET_REGIONS = gql`
	query getRegions {
		getRegions {
            id
            psgcCode
            regDesc
            regCode
        }
	}
`


export const GET_PROVINCES_BY_REGIONS = gql`
	query getProvincesByRegion($input: getProvincesByRegionInput) {
		getProvincesByRegion(input: $input) {
            regDesc
            regCode
            data {
              id
              psgcCode
              provDesc
              regCode
              provCode
            }
        }
	}
`

export const GET_CITIES_BY_PROVINCES = gql`
	query getCitiesByProvinces ($input: getCitiesByProvincesInput){
		getCitiesByProvinces(input: $input) {
            provDesc
            provCode
            data {
              id
              psgcCode
              citymunDesc
              regDesc
              provCode
              citymunCode
              coordinates {
                lon
                lat
              }
            }
        }
	}
`