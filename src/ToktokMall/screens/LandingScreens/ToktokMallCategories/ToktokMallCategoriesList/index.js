import React, { useState, useEffect } from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity} from 'react-native'
import {  LandingSubHeader, Product } from '../../../../Components'
import { COLOR, FONT, FONT_SIZE } from '../../../../../res/variables';

const testdata = [1,2,3,4]

export const ToktokMallCategoriesList = ({navigation, route})=> {

	const [searchValue, setSearchValue] = useState("")
	const [filteredData, setFilteredData] = useState(testdata)

	const handleOnSearch = (val) => {
		if(val == "") setFilteredData(testdata)
		else if(val != "") setFilteredData([])
	}

	useEffect(() => {
		if(route.params?.searchValue){
			setSearchValue(route.params.searchValue)
		}
	}, [route])

  return (
    <>
      <View style={styles.container}>

        <LandingSubHeader onSearch={handleOnSearch} initialValue={searchValue}  /> 

        <View>
					
					{filteredData.length == 0 &&
					<View style={{paddingHorizontal: 15, paddingVertical: 15}}>
						<Text style={{color: "#9E9E9E", fontSize: 14}}>No results found</Text>
					</View>}

          {filteredData.length > 0 && <Product />}

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