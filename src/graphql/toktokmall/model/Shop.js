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
				images {
					arrangement
					filename
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
    	images {
      	filename
    	}
		}
	}
`