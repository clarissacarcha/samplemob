import gql from 'graphql-tag'

export const GET_MY_CART =  gql`
	
	query getMyCart($input: GetMyCartInput) {
		getMyCart(input: $input){
			shop {
				id
				shopname
				profileImages{
					logo
				}
			}
			data {
				id
				quantity
				product {
					Id
					itemname
					price
					compareAtPrice
					noOfStocks
					img {
						filename
					}
				}
			}
		}
	}

`