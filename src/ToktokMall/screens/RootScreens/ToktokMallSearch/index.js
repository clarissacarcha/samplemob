import { debounce, filter } from 'lodash';
import React, {useState, useEffect, useRef} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image, Dimensions} from 'react-native';
import { SearchBar } from 'react-native-elements'
import Spinner from 'react-native-spinkit';
import { useLazyQuery } from '@apollo/react-hooks';
import Toast from 'react-native-simple-toast';

import {LandingSubHeader} from '../../../Components';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import {GET_TOP_PRODUCTS, SEARCH_PRODUCT, SEARCH_PRODUCT_SUGGESTIONS} from '../../../../graphql/toktokmall/model';

import { connect } from 'react-redux';

import {Product} from './components'
import {emptysearch} from '../../../assets'
import { FONT } from '../../../../res/variables';

const testdata = ["Gaming Chair", "Mousepad", "Face mask", "Pillow", "Ballpen"]

const Component = ({navigation, route, searchHistory, createSearchHistorySession}) => {

  const [searchPath, setSearchPath] = useState("all")
  const [emptySearch, setEmptySearch] = useState(false)
  const [suggest, setSuggest] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchHist, setSearchHist] = useState([])
  const [initialSearch, setInitialSearch] = useState(true)
  const [searchedProducts, setSearchedProducts] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [offset, setOffset] = useState(0)

  const [searchProduct, {error, loading}] = useLazyQuery(SEARCH_PRODUCT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: async (response) => {      

      let temp = searchedProducts
      if(!response){

        setSearchedProducts(temp)
        setEmptySearch(true)
        setSuggest(false)

      }else if(response && response.searchProduct.length > 0){

        temp = temp.concat(response.searchProduct)
        setSearchedProducts(temp.sort((a, b) => a.soldCount < b.soldCount ))
        setEmptySearch(false)
        setSuggest(false)
        
      }else if(response && response.searchProduct.length == 0){

        setSearchedProducts([])
        setEmptySearch(true)
        setSuggest(false)

      }
      
      if(!initialSearch){
        createSearchHistorySession("push", searchValue)
        setHistoryOrder()
      }

      setIsLoading(false)
      
    },
    onError: (err) => {
      console.log(err)
      setSearchedProducts([])
      setEmptySearch(true)
      setIsLoading(false)
    }
  })
  console.log("Search Result", searchedProducts)


  const [searchProductSuggestion, {error2, loading2}] = useLazyQuery(SEARCH_PRODUCT_SUGGESTIONS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: async (response) => {      
      if(response.searchProductSuggestions){
        setSuggest(true)
        setSuggestions(response.searchProductSuggestions)
      }
    },
    onError: (err) => {
      console.log(err)
      setSuggest(false)
      setIsLoading(false)
    }
  })

  const [getTopProducts] = useLazyQuery(GET_TOP_PRODUCTS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        offset: offset,
        limit: 10
      }
    },
    onCompleted: (response) => {
      let temp = searchedProducts
      if(response){
        temp = temp.concat(response.getTopProducts)
        setSearchedProducts(temp.sort((a, b) => a.weeklySold < b.weeklySold ))
      }else{
        setSearchedProducts(temp.sort((a, b) => a.weeklySold < b.weeklySold ))
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const [lazyLoading, {errorlazyload, loading3}] = useLazyQuery(SEARCH_PRODUCT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: async (response) => {      
      
      console.log("Lazy load", response)
      let temp = searchedProducts
      if(!response){

        setSearchedProducts(temp)
        setEmptySearch(true)
        setSuggest(false)

      }else if(response && response.searchProduct.length > 0){

        temp = temp.concat(response.searchProduct)
        setSearchedProducts(temp.sort((a, b) => a.soldCount < b.soldCount ))
        setEmptySearch(false)
        setSuggest(false)
        
      }else if(response && response.searchProduct.length == 0){

        // setSearchedProducts([])
        setEmptySearch(true)
        setSuggest(false)

      }
      setIsLoading(false)
      console.log("Lazy load", response)
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
    setEmptySearch(false)
    if(val == ""){
      setSearchedProducts([])
    }    
	}

  const setHistoryOrder = () => {
    let temphist = JSON.parse(JSON.stringify(searchHistory))
    setSearchHist(temphist)
  }

  useEffect(() => {
    console.log("Search History", searchHistory)
    setHistoryOrder()
  }, [searchHistory])

  useEffect(() => {
		if(route.params?.searchValue && route.params?.origin !== "relevant" && route.params?.origin !== "suggestion"){
      setInitialSearch(true)
			setSearchValue(route.params.searchValue)
			searchProduct({
        variables: {
          input: {
            search: route.params.origin ? "" : route.params.searchValue,
            origin: route.params?.origin ? `${route.params.origin}` : "all",
            category: route.params?.categoryId ? route.params?.categoryId : null,
            offset: offset,
            limit: 10
          }
        }
      })
      setIsLoading(true)
      console.log("Triggered on useEffect!", route.params)
		}
    if(route.params?.origin === "relevant"){
      setInitialSearch(true)
			setSearchValue(route.params.searchValue)
      console.log("datra", route.params.data)
      setSearchedProducts(route.params?.data)
    }
    if( route.params?.origin === "suggestion"){
      setInitialSearch(true)
			setSearchValue(route.params.searchValue)
      getTopProducts()
    }
  }, [route.params])
  
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingBottom = 20;
    // console.log(layoutMeasurement.height + contentOffset.y, contentSize.height - paddingBottom)
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingBottom;
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>

      <LandingSubHeader 
				// onSearch={debounce((val) => handleOnSearch(val), 500)}
        placeholder="Search"
				initialValue={searchValue}
        onClear={() => {
          setInitialSearch(false)
          setSearchValue([])
          setSearchedProducts([])
          setSuggestions([])
        }}
        onSearch={(val) => {
          setInitialSearch(false)
          setSearchValue(val)

          if(val == ""){
            setSearchedProducts([])
            setSuggestions([])
          }else if(val != "" ){
            searchProductSuggestion({
              variables: {
                input: {
                  search: val,
                  origin: "all",
                  offset: 0,
                  limit: 10
                }
              }
            })
          }
          
        }}
				onSubmit={async () => {
					if(searchValue != "" && searchValue != route.params?.searchValue){

            if(route.params?.searchValue){
              if(route.params?.searchValue == searchValue){
                setSearchedProducts([])                
              }
            }

            setSearchedProducts([])
            searchProduct({
              variables: {
                input: {
                  search: searchValue,
                  origin: "all",
                  offset: 0,
                  limit: 10
                }
              }
            })
            
          }else if(searchValue != "" && searchValue == route.params?.searchValue){

            setSearchedProducts([])
            searchProduct({
              variables: {
                input: {
                  search: route.params.origin ? "" : route.params.searchValue,
                  origin: route.params?.origin ? `${route.params.origin}` : "all",
                  category: route.params?.categoryId ? route.params?.categoryId : null,
                  offset: offset,
                  limit: 10
                }
              }
            })
          }
				}}
			/>

      <View style={{flex: 1}}>

        {searchedProducts.length == 0 && searchValue == "" && !loading && !loading2 && 
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
          data={searchHist.slice(0,5)}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#F7F7FA'}} />}
          // onScroll= {({nativeEvent}) => {
          //   console.log(nativeEvent)
          //   // if(isCloseToBottom(nativeEvent)){
          //   //   searchProduct({
          //   //     variables: {
          //   //       input: {
          //   //         search: item,
          //   //         origin: route.params?.origin ? route.params.origin : "all",
          //   //         category: route.params?.categoryId ? route.params?.categoryId : null,
          //   //         offset: offset,
          //   //         limit: 10
          //   //       }
          //   //     }
          //   //   })
          //   // }
          // }}
          renderItem={({item, index}) => 
            <TouchableOpacity key={index} onPress={() => {
              setInitialSearch(false)
              setSearchValue(item)
              searchProduct({
                variables: {
                  input: {
                    search: item,
                    origin: "all",
                    category: route.params?.categoryId ? route.params?.categoryId : null,
                    offset: 0,
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

        {error || !loading && !loading2 && !suggest && searchValue != "" && searchedProducts.length == 0 && emptySearch && 
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
		    			<Text style={{fontSize: 16, color: "#9E9E9E", fontWeight: 'bold'}}>No results found</Text>
              <Text style={{fontSize: 11, color: "#9E9E9E"}}>Try to search something similar</Text>              
	    			</View>
          </View>
          <View style={{flex: 0.2}} />
          </>
        }

        {!loading && !loading2 && searchedProducts.length > 0 && searchValue != "" && 
         <Product 
          state={false} 
          data={searchedProducts} 
          fetch={() => {
            setOffset(searchedProducts.length)
            console.log({offset})
            searchProduct({
              variables: {
                input: {
                  search: route.params?.origin ? "" : route.params.searchValue,
                  origin: route.params?.origin ? route.params.origin : "all",
                  category: route.params?.categoryId ? route.params?.categoryId : null,
                  offset: searchedProducts.length,
                  limit: 10
                }
              }
            })
          }} 
          lazyload={() => {
            console.log('VARIABLES',
              'search params', route.params?.origin ? "" : searchValue,
              'origin:', route.params?.origin ? route.params.origin : "all",
              'category:', route.params?.categoryId ? route.params?.categoryId : "null",
            
            )
            setOffset(searchedProducts.length)

            if( route.params?.origin === "suggestion"){
              getTopProducts({
                variables: {
                  input: {
                    offset: searchedProducts.length,
                    limit: 10
                  }
                }
              })
            }else{
              lazyLoading({
                variables: {
                  input: {
                    search: route.params?.origin ? "" : searchValue,
                    origin: route.params?.origin ? route.params.origin : "all",
                    category: route.params?.categoryId ? route.params?.categoryId : null,
                    offset: searchedProducts.length,
                    limit: 10
                  }
                }
              })
            }            
           
          }}
          loading2 = {loading3}
        />  }

        {loading && 
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Spinner 
              isVisible={loading}
              type='Circle'
              color={"#F6841F"}
              size={35}
            />
          </View>}

        {suggestions.length > 0 && suggest && searchValue != "" && !loading && 
        <>
          <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
            <Text style={{fontFamily: FONT.BOLD}}>Suggestions</Text>
          </View>
          <FlatList 
            data={suggestions}
            onScroll= {({nativeEvent}) => {
              console.log(nativeEvent)
              // if(isCloseToBottom(nativeEvent)){
              //   alert('close to bottom')
              //   searchProduct({
              //     variables: {
              //       input: {
              //         search: item.tags,
              //         origin: route.params?.origin ? route.params.origin : "all",
              //         category: route.params?.categoryId ? route.params?.categoryId : null,
              //         offset: offset,
              //         limit: 10
              //       }
              //     }
              //   })
              // }
            }}
            renderItem={({item, index}) => {
              return (
                <>
                  <TouchableOpacity onPress={() => {
                    setSearchedProducts([])
                    setSuggestions([])
                    setInitialSearch(false)
                    setSearchValue(item.tags)
                    searchProduct({
                      variables: {
                        input: {
                          search: item.tags,
                          origin: route.params?.origin ? route.params.origin : "all",
                          category: route.params?.categoryId ? route.params?.categoryId : null,
                          offset: 0,
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