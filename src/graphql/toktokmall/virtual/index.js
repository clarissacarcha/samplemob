import gql from 'graphql-tag'

export const GET_SIGNATURE = gql`
	query getSignature {
		getSignature
	}
`

export const POST_VERIFY_TOKTOKWALLET_PIN = gql`
	mutation postVerifyRequestTakeMoney($input: postVerifyRequestTakeMoneyInput!) {
		postVerifyRequestTakeMoney(input: $input){
			message
		}
	}
`