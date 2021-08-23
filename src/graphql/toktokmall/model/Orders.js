import gql from 'graphql-tag'


export const GET_PROCESSING_ORDERS = gql`
  query getProcessingOrders($input: GetOrdersInput) {
		getProcessingOrders(input: $input) {
	    referenceNum
  	  totalAmount
    	shipping {
      	shop {
        	id
        	shopname
      	}
  	    deliveryAmount
	      daystoship
    	  daystoshipTo
      	orderPlaced
    	}
	    orderData {
    	  productId
     		totalAmount
      	quantity
      	product {
        	itemname
        	compareAtPrice
        	variation
        	image {
          	filename
        	}
      	}        
    	}
    }
  }
`

export const GET_TOSHIP_ORDERS = gql`
  query getToShipOrders($input: GetOrdersInput) {
		getToShipOrders(input: $input) {
	    referenceNum
  	  totalAmount
    	shipping {
      	shop {
        	id
        	shopname
      	}
  	    deliveryAmount
	      daystoship
    	  daystoshipTo
      	orderPlaced
    	}
	    orderData {
    	  productId
     		totalAmount
      	quantity
      	product {
        	itemname
        	compareAtPrice
        	variation
        	image {
          	filename
        	}
      	}        
    	}
    }
  }
`

export const GET_TORECEIVE_ORDERS = gql`
	query getToReceiveOrders($input: GetOrdersInput) {
		getToReceiveOrders(input: $input) {
			id
			referenceNum
			totalAmount
			shipping {
				shop {
					id
					shopname
				}
				deliveryAmount
				daystoship
				daystoshipTo
				orderPlaced
				receiveBy
			}
			orderData {
				id
				productId
				totalAmount
				quantity
				product {
					itemname
					compareAtPrice
					variation
					image {
						filename
					}
				}        
			}
    }
  }
`

export const GET_COMPLETED_ORDERS = gql`
	query getCompletedOrders($input: GetOrdersInput) {
		getCompletedOrders(input: $input) {
			id
			referenceNum
			totalAmount
			formattedDateOrdered
			formattedDateReceived
			shipping {
				shop {
					id
					shopname
				}
				deliveryAmount
			}
			orderData {
				id
				productId
				totalAmount
				quantity
				product {
					itemname
					compareAtPrice
					variation
					image {
						filename
					}
				}        
			}
    }
  }
`