import gql from 'graphql-tag'

export const GET_ORDERS_NOTIFICATION = gql`
	query getOrdersNotification($input: GetNotificationInput) {
		getOrdersNotification(input: $input) {
			id
			orderId
			orderStatusCode
			referenceNum
			shopname
			read
			images {
				filename
			}
			orderStatusLatest {
				dateCreated
				content {
					title
					description
					formatDate
					formatTime
				}
			}
		}
	}
`