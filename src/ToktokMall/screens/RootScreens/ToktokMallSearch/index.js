import { filter } from 'lodash';
import React, {useState, useEffect, useRef} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import { SearchBar } from 'react-native-elements'
import Spinner from 'react-native-spinkit';
import { useLazyQuery } from '@apollo/react-hooks';
import Toast from 'react-native-simple-toast';

import {LandingSubHeader} from '../../../Components';
import { ASAddSearchHistory, ASClearSearchHistory, ASGetSearchHistory } from '../../../helpers/storage';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import {SEARCH_PRODUCT} from '../../../../graphql/toktokmall/model';

import {Product} from './components'

const testdata = ["Gaming Chair", "Mousepad", "Face mask", "Pillow", "Ballpen"]

export const ToktokMallSearch = ({navigation, route}) => {

  const [searchPath, setSearchPath] = useState("all")
  const [emptySearch, setEmptySearch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [searchHistoryCopy, setSearchHistoryCopy] = useState([])
  const [searchedProducts, setSearchedProducts] = useState([])

  const [searchProduct, {error, loading}] = useLazyQuery(SEARCH_PRODUCT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        search: searchValue
      }
    },
    onCompleted: async (response) => {      
			if(!response){
        setSearchedProducts([])
        setEmptySearch(true)
      }else if(response && response.searchProduct.length > 0){
        setSearchedProducts(response.searchProduct)
        setEmptySearch(false)
        //Save to AsyncStorage   
        await AddSearchHistory(searchValue)

      }else if(response && response.searchProduct.length == 0){
        setSearchedProducts([])
        setEmptySearch(true)
      }
      setIsLoading(false)
    },
    onError: (err) => {
      console.log(err)
      setEmptySearch(true)
      setIsLoading(false)
    }
  })

  const handleOnSearch = (val) => {    
		setSearchValue(val)
    if(val == ""){
      setSearchHistory(searchHistoryCopy.reverse())
      setSearchedProducts([])
    }else if(val != ""){
      setSearchHistory([])
    }    
    setEmptySearch(false)
	}

  const AddSearchHistory = async (value) => {
    await ASAddSearchHistory("bryan", value, async (result, data) => {
      GetSearchHistory("bryan")
    })
  }

  const GetSearchHistory = async (userId) => {
    await ASGetSearchHistory(userId, (result) => {
      setSearchHistory(result.reverse())
      setSearchHistoryCopy(result.reverse())
    })
  }

  const ClearSearchHistory = async () => {
    await ASClearSearchHistory("bryan", (res) => {
      setSearchHistoryCopy([])
      setSearchHistory([])
      Toast.show("Cleared search history")
    })
  }

  const init = async () => {
    await GetSearchHistory("bryan")
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
		if(route.params?.searchValue){
			setSearchValue(route.params.searchValue)
			searchProduct()
      setIsLoading(true)
      console.log("Triggered on useEffect!")
		}
	}, [route.params])

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>

      <LandingSubHeader 
				onSearch={(val) => handleOnSearch(val)}
				initialValue={searchValue}
				onSubmit={async () => {
          console.log("Triggered!!!")
					if(searchValue != ""){
            // searchProduct()
            await AddSearchHistory(searchValue)
          }
				}}
			/>

      <View style={{flex: 1}}>

        {searchedProducts.length == 0 && searchValue == "" &&
        <>
        <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 14}}>Search History</Text>
          </View>
          <TouchableOpacity onPress={async () => {
            await ClearSearchHistory()
          }} style={{flex: 1}}>
            <Text style={{fontSize: 12, textAlign: 'right', color: '#F6841F'}}>Clear History</Text>
          </TouchableOpacity>
        </View> 
        <FlatList 
          data={searchHistory}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#F7F7FA'}} />}
          renderItem={({item}) => 
            <View style={{paddingHorizontal: 15, paddingVertical: 15}}>
              <Text style={{color: "#9E9E9E", fontSize: 14}}>{item}</Text>
            </View>
          }
        />
        </>}

        {error || !loading && searchValue != "" && searchedProducts.length == 0 && emptySearch && 
					<View style={{paddingHorizontal: 15, paddingVertical: 15}}>
						<Text style={{color: "#9E9E9E", fontSize: 14}}>No results found</Text>
					</View>
        }

        {!loading && searchedProducts.length > 0 && searchValue != "" && <Product data={searchedProducts} />}

        {loading && 
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Spinner 
              isVisible={loading}
              type='Circle'
              color={"#F6841F"}
              size={35}
            />
          </View>}

      </View>
    </View>
  );
};
