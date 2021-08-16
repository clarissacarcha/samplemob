import gql from 'graphql-tag'

export const GET_CITIES = gql`
	query getCities {
		getCities {
            id
            citymunDesc
            citymunCode
        }
	}
`