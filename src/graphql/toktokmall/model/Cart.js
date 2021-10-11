import gql from 'graphql-tag'

export const GET_MY_CART =  gql`
	
	query getMyCart($input: GetMyCartInput) {
		getMyCart(input: $input){
			shop {
				shopname
				profileImages{
					logo
				}
			}
			data {
				id
				quantity
				product {
					itemname
					price
					compareAtPrice
					img {
						filename
					}
				}
			}
		}
	}

`