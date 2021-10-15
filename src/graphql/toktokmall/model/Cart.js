import gql from 'graphql-tag'

export const GET_MY_CART =  gql`
	
	query getMyCart($input: GetMyCartInput) {
		getMyCart(input: $input){
			total
			raw {
				shopid
				branchid
				userid
				quantity
				productid
			}
			parsed {
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
	}

`