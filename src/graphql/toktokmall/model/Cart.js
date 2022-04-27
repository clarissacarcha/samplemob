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
					name
					variant
					price
					compareAtPrice
					noOfStocks
					contSellingIsset
					img {
						filename
					}
					enabled
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
						name
						variant
						price
						compareAtPrice
						noOfStocks
						contSellingIsset
						img {
							filename
						}
						enabled
						promotions {
							promoType
							promoPrice
							promoRate
							name
							lossPromo
							duration
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
			productId
			quantity
			variant
			code
			status
			message
			price
			compareAtPrice
		}
	}
`

export const CHECK_ITEM_FROM_CART = gql`
	query checkItemFromCart($input: CheckItemFromCartInput) {
		checkItemFromCart(input: $input) {
			id
			quantity
		}
	}
`

export const GET_VERIFY_CHECKOUT = gql`
	query getVerifyCheckout($input: GetVerifyCheckoutInput) {
		getVerifyCheckout(input: $input){
			isValid
			validItems
			invalidItems
		}
	}
`