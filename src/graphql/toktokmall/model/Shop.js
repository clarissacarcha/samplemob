import gql from 'graphql-tag'

export const GET_SHOP_DETAILS = gql`
  query getShopDetails($input: GetShopDetailsInput){
    getShopDetails(input: $input){
	  	id
      shopcode
    	shopname
    	address
    	totalProducts
			products {
				Id
				itemname
				price
				discountRate
				soldCount
				refComDiscountRate
				compareAtPrice
				noOfStocks
				images {
					arrangement
					filename
				}
				promoIsset
				promotions {
					promoType
	  	    promoPrice
  	  	  promoRate
      		name
      		lossPromo
      		duration
				}
			}
    	profileImages {
      	logo
      	banner
    	}
    }
  }
`

export const SEARCH_SHOP_PRODUCT = gql`
	query searchShopProduct($input: SearchShopProductInput){
		searchShopProduct(input: $input){
			Id
    	sysShop
    	itemname
    	price
			discountRate
			compareAtPrice
			soldCount
			noOfStocks
			refComDiscountRate
			images {
				filename
			}
			promoIsset
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
`

export const GET_SHOP_SEARCH_SUGGESTIONS = gql`
	query getSearchSuggestions($input: SearchShopProductInput){
		getSearchSuggestions(input: $input){
			Id
			sysShop
			itemname
			tags
			price
			discountRate
			noOfStocks
			images {
				filename
			}
			promoIsset
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
`