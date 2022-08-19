import React, {useState, useEffect} from 'react';
import {View, Text, Image, FlatList, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import Toast from 'react-native-simple-toast';
import {LandingSubHeader, Dropdown, MessageModal} from '../../../Components';
import { Product} from './components';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_SHOP_DETAILS, SEARCH_SHOP_PRODUCT, GET_SHOP_SEARCH_SUGGESTIONS } from '../../../../graphql/toktokmall/model';
import { useLazyQuery } from '@apollo/react-hooks';
import Spinner from 'react-native-spinkit';
import { FONT, COLOR } from '../../../../res/variables';
import {emptysearch, placeholder} from "../../../assets";
import { connect, useSelector } from 'react-redux';
import { getRefComAccountType } from '../../../helpers';

const Component = ({navigation, route, searchHistory, createSearchHistorySession}) => {

  const session = useSelector(state=>state.session)
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
        // setSearchedProducts(temp)
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
      console.log(response.getSearchSuggestions)
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

  const getImageSource = (data) => {
    if(data.length > 0){
      return {uri: data[0].filename}
    }else {
      return placeholder
    }
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
    <View style={styles.container}>
      <View style={styles.flex1}>

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
                    limit: 10,
                    refCom: getRefComAccountType({session})
                  }
                }
              })
            }
            
          }}
        />

        {emptySearch &&
          <>
          <View style={styles.emptyContainer}>
            <Image 
		  			  source={emptysearch}
	  				  style={styles.emptyImage}
  				  />
            <View style={styles.margin1} />
            <View style={styles.noResultContainer}>
		    			<Text style={styles.noResultText1}>No results found</Text>
              <Text style={styles.noResultText2}>Try to search something similar</Text>              
	    			</View>
          </View>
          <View style={styles.flex02} />
          </>}

        {loading && 
        <View style={styles.loadingContainer}>
          <Spinner 
            isVisible={loading}
            type='Circle'
            color={"#F6841F"}
            size={35}
          />
        </View>}

        {error && 
        <View style={styles.errorContainer}>
          <Text>Something went wrong</Text>
        </View>}

        {suggestions.length > 0 && 
        <>
          {/* <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
            <Text style={{fontFamily: FONT.BOLD}}>Suggestions</Text>
          </View> */}
          <View style={styles.productTitleContainer}>
            <Text style={styles.productTitleText}>Product</Text>
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
                          limit: 10,
                          refCom: getRefComAccountType({session})
                        }
                      }
                    })
                  }} style={styles.tagsContainer}>
                     {/* <View style = {{height: 33, width: 33, borderRadius: 8, backgroundColor: 'black', marginRight: 10}} /> */}
                    <Image
                      style = {styles.image}
                      source={getImageSource(item?.images || [])}
                    />
                    <Text style={styles.tagsText}>{item.tags}</Text>
                  </TouchableOpacity>
                  {index < suggestions.length - 1 && <View style={styles.margin2} />}
                </>
              )
            }}
          />
        </>}

        {searchedProducts.length == 0 && searchValue == "" && !loading && 
        <>
        <View style={styles.searchContainer}>
          <View style={styles.flex1}>
            <Text style={styles.searchTitle}>Search History</Text>
          </View>
          <TouchableOpacity onPress={async () => {
            await createSearchHistorySession("clear")
            Toast.show("Cleared search history")
          }} style={{flex: 1}}>
            <Text style={styles.clearSearchText}>Clear History</Text>
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
                    limit: 10,
                    refCom: getRefComAccountType({session})
                  }
                }
              })
            }} style={styles.itemButton}>
              <Text style={styles.itemText}>{item}</Text>
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
                    limit: 10,
                    refCom: getRefComAccountType({session})
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

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "#fff"
  },
  flex1: {
    flex: 1
  },
  emptyContainer: {
    flex: 1, 
    backgroundColor: 'white', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  emptyImage: {
    width: '70%', 
    height: Dimensions.get("screen").height / 4, 
    resizeMode: 'contain'
  },
  margin1: {
    height: 20
  },
  noResultContainer: {
    alignItems: 'center', 
    justifyContent: 'center'
  },
  noResultText1: {
    fontSize: 16, 
    color: COLOR.ORANGE
  },
  noResultText2: {
    fontSize: 11, 
    color: "#9E9E9E"
  },
  flex02: {
    flex: 0.2
  },
  loadingContainer: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  errorContainer: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  productTitleContainer: {
    paddingHorizontal: 20, 
    paddingVertical: 10
  },
  productTitleText: {
    fontFamily: FONT.REGULAR, 
    color: COLOR.ORANGE
  },
  tagsContainer: {
    paddingHorizontal: 20, 
    paddingVertical: 8, 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  image: {
    height: 33, 
    width: 33, 
    borderRadius: 8, 
    marginRight: 10
  },
  tagsText: {
    color: "black", 
    fontSize: 13, 
    textTransform: 'capitalize'
  },
  margin2: {
    height: 1, 
    backgroundColor: "#F7F7FA"
  },
  searchContainer: {
    flexDirection: 'row', 
    paddingVertical: 15, 
    paddingHorizontal: 15
  },
  searchTitle: {
    fontSize: 14
  },
  clearSearchText: {
    fontSize: 12, 
    textAlign: 'right', 
    color: '#F6841F'
  },
  itemButton: {
    paddingHorizontal: 15, 
    paddingVertical: 15
  },
  itemText: {
    color: "#9E9E9E", 
    fontSize: 14
  },
}) 