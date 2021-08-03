import React, { useState, useEffect } from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity} from 'react-native'
import {  LandingSubHeader } from '../../../../Components'
import {Product} from './components'
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import {SEARCH_PRODUCT} from '../../../../../graphql/toktokmall/model';

const testdata = [1,2,3,4]

export const ToktokMallCategoriesList = ({navigation, route})=> {

	const [searchValue, setSearchValue] = useState("")
	const [filteredData, setFilteredData] = useState(testdata)
	const [searchedProducts, setSearchedProducts] = useState([])

	const handleOnSearch = (val) => {
		if(val == "") setFilteredData(testdata)
		else if(val != "") setFilteredData([])
	}

	const [searchProduct, {error2, loading2}] = useLazyQuery(SEARCH_PRODUCT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        search: searchValue
      }
    },
    onCompleted: (response) => {
      console.log(response)
			if(!response){
        setSearchedProducts([])
      }else if(response && response.searchProduct.length > 0){
        setSearchedProducts(response.searchProduct)
      }else if(response && response.searchProduct.length == 0){
        setSearchedProducts([])
      }
    },
    onError: (err) => {
      console.log(err)
      setEmptySearch(true)
    }
  })

	useEffect(() => {
		if(route.params?.searchValue){
			setSearchValue(route.params.searchValue)
			searchProduct()
		}
	}, [route])

  return (
    <>
      <View style={styles.container}>

        <LandingSubHeader 
					onSearch={handleOnSearch} 
					initialValue={searchValue}  
					onSubmit={() => {
						searchProduct()
					}}
				/> 

        <View>
					
					{searchedProducts.length == 0 &&
					<View style={{paddingHorizontal: 15, paddingVertical: 15}}>
						<Text style={{color: "#9E9E9E", fontSize: 14}}>No results found</Text>
					</View>}

          {searchedProducts.length > 0 && <Product data={searchedProducts} />}

        </View>

      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  	backgroundColor: COLOR.WHITE
  }
})