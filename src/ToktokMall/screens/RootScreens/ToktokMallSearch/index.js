import { debounce, filter } from 'lodash';
import React, {useState, useEffect, useRef} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image, Dimensions} from 'react-native';
import { SearchBar } from 'react-native-elements'
import Spinner from 'react-native-spinkit';
import { useLazyQuery } from '@apollo/react-hooks';
import Toast from 'react-native-simple-toast';

import {LandingSubHeader} from '../../../Components';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import {SEARCH_PRODUCT} from '../../../../graphql/toktokmall/model';

import { connect } from 'react-redux';

import {Product} from './components'
import {emptysearch} from '../../../assets'

const testdata = ["Gaming Chair", "Mousepad", "Face mask", "Pillow", "Ballpen"]

const Component = ({navigation, route, searchHistory, createSearchHistorySession}) => {

  const [searchPath, setSearchPath] = useState("all")
  const [emptySearch, setEmptySearch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchHist, setSearchHist] = useState([])
  const [searchedProducts, setSearchedProducts] = useState([])
  const [offset, setOffset] = useState(0)

  const [searchProduct, {error, loading}] = useLazyQuery(SEARCH_PRODUCT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: async (response) => {      

      let temp = searchedProducts
      if(!response){

        setSearchedProducts(temp)
        setEmptySearch(true)

      }else if(response && response.searchProduct.length > 0){

        temp = temp.concat(response.searchProduct)
        setSearchedProducts(temp)
        setEmptySearch(false)
        
      }else if(response && response.searchProduct.length == 0){

        setSearchedProducts([])
        setEmptySearch(true)

      }
      
      if(!route.params?.origin){
        createSearchHistorySession("push", searchValue)
        setHistoryOrder()
      }

      setIsLoading(false)
      console.log("Search Result", response)
      
    },
    onError: (err) => {
      console.log(err)
      setSearchedProducts([])
      setEmptySearch(true)
      setIsLoading(false)
    }
  })

  const [getProductsLazyLoad, {error2, loading2}] = useLazyQuery(SEARCH_PRODUCT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        search: searchValue,
        origin: route.params?.origin ? route.params.origin : "all",
        offset: searchedProducts.length + 10,
        limit: 10
      }
    },
    onCompleted: async (response) => {      
      console.log('lazy load fired')
      let temp2 = searchedProducts
      if(response){
        console.log('RESPONSE FROM DB',response)
        temp2 = temp2.concat(response.searchProduct)
        setSearchedProducts(temp2)
        // setProducts(response.getProducts)
      }else{
        setSearchedProducts(temp2)
      }
      console.log('searchedProducts', temp2)
      setOffset(searchedProducts.length + 10)
      
    },
    onError: (err) => {
      console.log(err)
      setSearchedProducts([])
      setEmptySearch(true)
      setIsLoading(false)
    }
  })

  const handleOnSearch = (val) => {    
		setSearchValue(val)
    setOffset(0)
    searchProduct({
      variables: {
        input: {
          search: val,
          origin: route.params?.origin ? route.params.origin : "all",
          offset: 0,
          limit: 10
        }
      }
    })
    if(val == ""){
      setSearchedProducts([])
    }else if(val != ""){
    }
    setEmptySearch(false)
	}

  const setHistoryOrder = () => {
    let temphist = JSON.parse(JSON.stringify(searchHistory))
    setSearchHist(temphist.reverse())
  }

  useEffect(() => {
    console.log("Search History", searchHistory)
    setHistoryOrder()
  }, [searchHistory])

  useEffect(() => {
		if(route.params?.searchValue){
			setSearchValue(route.params.searchValue)
			searchProduct({
        variables: {
          input: {
            search: route.params.origin ? "" : route.params.searchValue,
            origin: route.params?.origin ? `${route.params.origin}` : "all",
            offset: offset,
            limit: 10
          }
        }
      })
      setIsLoading(true)
      console.log("Triggered on useEffect!", route.params)
		}
	}, [route.params])

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>

      <LandingSubHeader 
				onSearch={debounce((val) => handleOnSearch(val), 500)}
				initialValue={searchValue}
				// onSubmit={async () => {
        //   console.log("Triggered!!!")
				// 	if(searchValue != ""){
            
        //   }
				// }}
			/>

      <View style={{flex: 1}}>

        {searchedProducts.length == 0 && searchValue == "" &&
        <>
        <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 14}}>Search History</Text>
          </View>
          <TouchableOpacity onPress={async () => {
            // await ClearSearchHistory()
            await createSearchHistorySession("clear")
            Toast.show("Cleared search history")
          }} style={{flex: 1}}>
            <Text style={{fontSize: 12, textAlign: 'right', color: '#F6841F'}}>Clear History</Text>
          </TouchableOpacity>
        </View> 
        <FlatList 
          data={searchHist}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#F7F7FA'}} />}
          renderItem={({item, index}) => 
            <TouchableOpacity key={index} onPress={() => {
              setSearchValue(item)
            }} style={{paddingHorizontal: 15, paddingVertical: 15}}>
              <Text style={{color: "#9E9E9E", fontSize: 14}}>{item}</Text>
            </TouchableOpacity>
          }
        />
        </>}

        {error || !loading && searchValue != "" && searchedProducts.length == 0 && emptySearch && 
					// <View style={{paddingHorizontal: 15, paddingVertical: 15}}>
					// 	<Text style={{color: "#9E9E9E", fontSize: 14}}>No results found</Text>
					// </View>
          <>
          <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
            <Image 
		  			  source={emptysearch}
	  				  style={{width: '70%', height: Dimensions.get("screen").height / 4, resizeMode: 'contain'}}
  				  />
            <View style={{height: 20}} />
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
		    			<Text style={{fontSize: 16, color: "#9E9E9E"}}>No products found</Text>
              <Text style={{fontSize: 11, color: "#9E9E9E"}}>Try different or more general keywords</Text>              
	    			</View>
          </View>
          <View style={{flex: 0.2}} />
          </>
        }

        {!loading && searchedProducts.length > 0 && searchValue != "" && 
        <Product 
          state={false} 
          data={searchedProducts} 
          fetch={() => {
            setOffset(searchedProducts.length)
            console.log({offset})
            searchProduct({
              variables: {
                input: {
                  search: searchValue,
                  origin: route.params?.origin ? route.params.origin : "all",
                  offset: searchedProducts.length,
                  limit: 10
                }
              }
            })
          }}
          lazyload={() => {
            setOffset(searchedProducts.length + 10)
            console.log('lazyload', {offset},  searchValue, route.params.origin  )
            getProductsLazyLoad()
          }}
        />}

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

const mapStateToProps = (state) => ({
  searchHistory: state.toktokMall.searchHistory
})

const mapDispatchToProps = (dispatch) => ({
  createSearchHistorySession: (action, payload) => dispatch({type: 'CREATE_SEARCH_HISTORY_SESSION', action,  payload}),
});

export const ToktokMallSearch = connect(mapStateToProps, mapDispatchToProps)(Component);