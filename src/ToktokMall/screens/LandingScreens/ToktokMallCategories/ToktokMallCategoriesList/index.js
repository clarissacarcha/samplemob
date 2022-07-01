import React, { useState, useEffect } from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity} from 'react-native'
import { useLazyQuery } from '@apollo/react-hooks';
import Spinner from 'react-native-spinkit';
import {  LandingSubHeader } from '../../../../Components'
import {Product} from './components'
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';
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
    setSearchValue(val)
	}

	const [searchProduct, {error, loading}] = useLazyQuery(SEARCH_PRODUCT, {
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

        //Save to AsyncStorage


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
						if(searchValue != "") searchProduct()
					}}
          onBack={() => {
            navigation.navigate("ToktokMallSearch", {})
          }}
				/>

        <View style={styles.subContainer}>

					{error || !loading && searchValue != "" && searchedProducts.length == 0 &&
					<View style={styles.noResultContainer}>
						<Text style={styles.noResultText}>No results found</Text>
					</View>}

          {!loading && searchedProducts.length > 0 && <Product data={searchedProducts} />}

          {loading && 
          <View style={styles.spinnerContainer}>
            <Spinner 
              isVisible={loading}
              type='Circle'
              color={"#F6841F"}
              size={35}
            />
          </View>}

        </View>

      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  	backgroundColor: COLOR.WHITE
  },
  subContainer: {
    flex: 1
  },
  noResultContainer: {
    paddingHorizontal: 15, 
    paddingVertical: 15
  },
  noResultText: {
    color: "#9E9E9E", 
    fontSize: 14
  },
  spinnerContainer: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  }
})