import React, {useState, useEffect} from 'react';
import {View, Text, Image, FlatList, TouchableOpacity, Dimensions} from 'react-native';
import Toast from 'react-native-simple-toast';
import {LandingSubHeader, Dropdown, MessageModal} from '../../../Components';
import { Product} from './components';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_SHOP_DETAILS, SEARCH_SHOP_PRODUCT, GET_SHOP_SEARCH_SUGGESTIONS } from '../../../../graphql/toktokmall/model';
import { useLazyQuery } from '@apollo/react-hooks';
import Spinner from 'react-native-spinkit';
import { FONT } from '../../../../res/variables';
import {emptysearch} from "../../../assets";
import { connect } from 'react-redux';

const Component = ({navigation, route, searchHistory, createSearchHistorySession}) => {

  const [searchedProducts, setSearchedProducts] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [emptySearch, setEmptySearch] = useState(false)
  const [searchHist, setSearchHist] = useState([])

  const [searchShopProduct, {error, loading}] = useLazyQuery(SEARCH_SHOP_PRODUCT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      if(!response){
        setEmptySearch(true)
      }else if(response && response.searchShopProduct.length > 0){
        setEmptySearch(false)
        setSearchedProducts(response.searchShopProduct)
      }else if(response && response.searchShopProduct.length == 0){
        setEmptySearch(true)
        setSearchedProducts([])
      }
      createSearchHistorySession("push", searchValue)
      
    },
    onError: (err) => {
      console.log(err)
      setEmptySearch(true)
    }
  })

  const [lazyloadSearchProduct, {error3, loading3}] = useLazyQuery(SEARCH_SHOP_PRODUCT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      let temp = searchedProducts
      if(!response){
        setSearchedProducts(temp)
      }else if(response && response.searchShopProduct.length > 0){
        temp = temp.concat(response.searchShopProduct)
        console.log(searchedProducts.length, response.searchShopProduct.length)
        setSearchedProducts(temp)
      }else if(response && response.searchShopProduct.length == 0){
        setSearchedProducts(temp)
      }
    },
    onError: (err) => {
      console.log(err)
      setEmptySearch(true)
    }
  })

  const [getSuggestions, {error2, loading2}] = useLazyQuery(GET_SHOP_SEARCH_SUGGESTIONS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        shopId: route.params.id,
        search: searchValue,
        offset: 0,
        limit: 10
      }
    },
    onCompleted: (response) => {
      if(response.getSearchSuggestions){
        setSuggestions(response.getSearchSuggestions)
      }
    },
    onError: (err) => {
      console.log(err)
      setEmptySearch(true)
    }
  })

  const setHistoryOrder = () => {
    let temphist = JSON.parse(JSON.stringify(searchHistory))
    setSearchHist(temphist.reverse())
  }

  useEffect(() => {
    setHistoryOrder()
  }, [searchHistory])

  useEffect(() => {
    // getShopDetails()
    return () => {
      setSearchedProducts([])
      setSearchValue("")
      setSuggestions([])
      setEmptySearch(false)
    }
  }, [])

  return (
    <View style={{flex: 1, backgroundColor: "#fff"}}>
      <View style={{flex: 1}}>

        <LandingSubHeader  
          placeholder="Search in Store"
          initialValue={searchValue}
          focused={true}
          onSearch={(val) => {

            setEmptySearch(false)

            if(val == ""){
              setSuggestions([])
              setSearchedProducts([])
              setSearchValue(val)
            }else{
              setSearchedProducts([])
              setSearchValue(val)
  
              getSuggestions({
                variables: {
                  input: {
                    shopId: route.params.id,
                    search: val,
                    offset: 0,
                    limit: 100
                  }
                }
              })
            }

          }}
          onSubmit={() => {

            if(searchValue != ""){
              setSuggestions([])
              createSearchHistorySession("push", searchValue)
              searchShopProduct({
                variables: {
                  input: {
                    shopId: route.params.id,
                    search: searchValue,
                    offset: 0,
                    limit: 10
                  }
                }
              })
            }
            
          }}
        />

        {emptySearch &&
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
          </>}

        {loading && 
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Spinner 
            isVisible={loading}
            type='Circle'
            color={"#F6841F"}
            size={35}
          />
        </View>}

        {error && 
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Something went wrong</Text>
        </View>}

        {suggestions.length > 0 && 
        <>
          <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
            <Text style={{fontFamily: FONT.BOLD}}>Suggestions</Text>
          </View>
          <FlatList 
            data={suggestions}
            renderItem={({item, index}) => {
              return (
                <>
                  <TouchableOpacity onPress={() => {
                    setSuggestions([])
                    setSearchValue(item.tags)
                    searchShopProduct({
                      variables: {
                        input: {
                          shopId: route.params.id,
                          search: item.tags,
                          offset: searchedProducts.length,
                          limit: 10
                        }
                      }
                    })
                  }} style={{paddingHorizontal: 20, paddingVertical: 8}}>
                    <Text style={{color: "#9E9E9E", fontSize: 13, textTransform: 'capitalize'}}>{item.tags}</Text>
                  </TouchableOpacity>
                  {index < suggestions.length - 1 && <View style={{height: 1, backgroundColor: "#F7F7FA"}} />}
                </>
              )
            }}
          />
        </>}

        {searchedProducts.length == 0 && searchValue == "" && !loading && 
        <>
        <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 14}}>Search History</Text>
          </View>
          <TouchableOpacity onPress={async () => {
            await createSearchHistorySession("clear")
            Toast.show("Cleared search history")
          }} style={{flex: 1}}>
            <Text style={{fontSize: 12, textAlign: 'right', color: '#F6841F'}}>Clear History</Text>
          </TouchableOpacity>
        </View> 
        <FlatList 
          data={searchHistory.slice(0,5)}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#F7F7FA'}} />}
          renderItem={({item, index}) => 
            <TouchableOpacity key={index} onPress={() => {
              setSearchValue(item)
              searchShopProduct({
                variables: {
                  input: {
                    shopId: route.params.id,
                    search: item,
                    offset: searchedProducts.length,
                    limit: 10
                  }
                }
              })
            }} style={{paddingHorizontal: 15, paddingVertical: 15}}>
              <Text style={{color: "#9E9E9E", fontSize: 14}}>{item}</Text>
            </TouchableOpacity>
          }
        />
        </>}
        
        {
          !error && 
          !loading && 
          searchedProducts.length > 0 &&
          !emptySearch && 
          <Product 
            paginate={false} 
            data={searchedProducts} 
            lazyload={() => {
              lazyloadSearchProduct({
                variables: {
                  input: {
                    shopId: route.params.id,
                    search: searchValue,
                    offset: searchedProducts.length,
                    limit: 10
                  }
                }
              })
            }} 
          />
        }

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

export const ToktokMallStoreSearch = connect(mapStateToProps, mapDispatchToProps)(Component);