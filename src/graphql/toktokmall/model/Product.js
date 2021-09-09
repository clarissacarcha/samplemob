import gql from 'graphql-tag'


export const GET_ACCOUNT = gql`
  query getAccount($input: GetAccountInput){
        getAccount(input: $input){
            id
            mobileNumber
            status
            motherId
            person {
                id
                firstName
                middleName
                lastName
            }
        }
    }
`

export const GET_PRODUCTS = gql`
		query getProducts($input: GetProductsInput){
			getProducts(input: $input){
				Id
				itemname
				price
				soldCount
			    noOfStocks
				discountRate
				images {
					arrangement
					filename
				}
			}
		}
`

export const GET_TOP_PRODUCTS = gql`
		query getTopProducts($input: GetProductsInput){
			getTopProducts(input: $input){
				Id
				itemname
				price
				soldCount
			  noOfStocks
			  discountRate
				images {
					arrangement
					filename
				}
			}
		}
`

export const GET_FEATURED_PRODUCTS = gql`
		query getFeaturedProducts($input: GetProductsInput){
			getFeaturedProducts(input: $input){
				Id
				itemname
				price
				soldCount
				noOfStocks
				discountRate
				otherinfo
				compareAtPrice
				images {
					arrangement
					filename
				}
			}
		}
`

export const GET_ADS = gql`
		query {
			getAdvertisements{
				Id
				price
				image 
			}
		}
`

export const GET_PROMOTIONS = gql`
		query {
			getPromotions {
				productId
				promoPrice
				startDate
				endDate
				product {
					itemname
					otherinfo
					price
					compareAtPrice
					images {
						filename
						arrangement
					}
				}
			}
		}
`

export const GET_CATEGORIES = gql`
		query {
			getCategories {
				categoryName
				image {
					filename
				}
			}
		}
`

export const GET_PRODUCT_BY_CATEGORY = gql`
	query getProductByCategory($input: GetProductByCategoryInput){
		getProductByCategory(input: $input){
			itemname
    	price
    	compareAtPrice
		discountRate
    	variantSummary {
      	variantType
      	variantList
    	}
    	images {
      	arrangement
     		filename
    	}
		}
	}
`

export const GET_PRODUCT_DETAILS = gql`
	query getProductDetails($input: GetProductDetailsInput){
		getProductDetails(input: $input){
			Id
			itemname
    	otherinfo
    	summary
    	tags
    	noOfStocks
    	price
    	compareAtPrice
		discountRate
    	images {
      	arrangement
      	filename
    	}
    	shop {
			id
			shopcode
     		shopname
			address
			totalProducts
			profileImages {
				logo
			}
    	}
    	variantSummary {
      	optionNo
      	variantType
      	variantList
				variantProducts {
					Id
					itemname
					images {
						filename
					}
				}
    	}
			relevantProducts {
				Id
				itemname
				price
				soldCount
			  noOfStocks
			  discountRate
				images {
					arrangement
					filename
				}
			}
		}
	}
`

export const SEARCH_PRODUCT = gql`
	query searchProduct($input: SearchProductInput){
		searchProduct(input: $input){
			Id
    	itemname
    	price
		discountRate
    	images {
      	arrangement
      	filename
    	}
		}
	}
`

export const SEARCH_PRODUCT_SUGGESTIONS = gql`
	query searchProductSuggestions($input: SearchProductInput){
		searchProductSuggestions(input: $input){
      itemname
			tags
		}
	}
`