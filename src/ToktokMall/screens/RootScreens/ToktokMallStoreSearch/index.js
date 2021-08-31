import React, {useState, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import Toast from 'react-native-simple-toast';
import {LandingSubHeader, Dropdown, MessageModal} from '../../../Components';
import { Product} from './components';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_SHOP_DETAILS, SEARCH_SHOP_PRODUCT } from '../../../../graphql/toktokmall/model';
import { useLazyQuery } from '@apollo/react-hooks';
import Spinner from 'react-native-spinkit';

export const ToktokMallStoreSearch = ({navigation, route}) => {

  const [searchedProducts, setSearchedProducts] = useState([])
  const [storeData, setStoreData] = useState({})
  const [activeTab, setActiveTab] = useState(0)
  const [showCategories, setShowCategories] = useState(false)
  const [messageModalShown, setMessageModalShown] = useState(false)
  const [messageModalContent, setMessageModalContent] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [emptySearch, setEmptySearch] = useState(false)

  const [searchShopProduct, {error, loading}] = useLazyQuery(SEARCH_SHOP_PRODUCT, {
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
      if(!response){
        setEmptySearch(true)
      }else if(response && response.searchShopProduct.length > 0){
        setEmptySearch(false)
        setSearchedProducts(response.searchShopProduct)
      }else if(response && response.searchShopProduct.length == 0){
        setEmptySearch(true)
        setSearchedProducts([])
      }
    },
    onError: (err) => {
      console.log(err)
      setEmptySearch(true)
    }
  })

  useEffect(() => {
    // getShopDetails()
  }, [])

  return (
    <View style={{flex: 1, backgroundColor: "#fff"}}>
      <View style={{flex: 1}}>

        <LandingSubHeader  
          placeholder="Search in Store"
          focused={true}
          onSearch={(val) => {
            setSearchedProducts([])
            setSearchValue(val)
          }}
          onSubmit={() => {
            searchShopProduct({
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

        {emptySearch &&
        <View style={{paddingHorizontal: 15, paddingVertical: 15}}>
          <Text style={{color: "#F6841F", fontSize: 14}}>No results found</Text>
        </View>}

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
        
        {
          !error && 
          !loading && 
          searchedProducts.length > 0 &&
          !emptySearch && 
          <Product 
            paginate={false} 
            data={searchedProducts} 
            onReload={() => {
            
            }} 
          />
        }

      </View>
    </View>
  );
};
