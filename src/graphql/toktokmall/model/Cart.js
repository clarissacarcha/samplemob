import gql from 'graphql-tag'

export const GET_MY_CART =  gql`
	
	query getMyCart($input: GetMyCartInput) {
		getMyCart(input: $input){
			count
			total
			raw {
				shopid
				branchid
				userid
				quantity
				productid
				product {
					itemname
					price
					compareAtPrice
					noOfStocks
					img {
						filename
					}
				}
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
					shopid
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

export const GET_VERIFY_ADD_TO_CART = gql`
	query getVerifyAddToCart($input: GetVerifyAddToCartInput) {
		getVerifyAddToCart(input: $input) {
			quantity
			variant
			code
			status
			message
		}
	}
`