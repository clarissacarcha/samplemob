import gql from 'graphql-tag'

export const GET_MY_FAVORITES = gql`
	query getMyFavorites($input: GetMyFavoritesInput) {
		getMyFavorites(input: $input) {
			id
	    items {
				product {
				Id
				itemname
				otherinfo
				price
				compareAtPrice
				discountRate
				noOfStocks
				images {
						filename
					}
				}
			}
    	shop {
			id
      	shopname
      	profileImages {
        	logo
        	banner
	      }
  	  }
    }
	}
`