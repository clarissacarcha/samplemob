import React, {useState, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import Toast from 'react-native-simple-toast';
import {LandingSubHeader, Dropdown, MessageModal} from '../../../Components';
import {Tab, Store, Product} from './components';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_SHOP_DETAILS, SEARCH_SHOP_PRODUCT } from '../../../../graphql/toktokmall/model';
import { useLazyQuery } from '@apollo/react-hooks';
import Spinner from 'react-native-spinkit';

export const ToktokMallStore = ({navigation, route}) => {

  const [searchedProducts, setSearchedProducts] = useState([])
  const [storeData, setStoreData] = useState({})
  const [activeTab, setActiveTab] = useState(0)
  const [showCategories, setShowCategories] = useState(false)
  const [messageModalShown, setMessageModalShown] = useState(false)
  const [messageModalContent, setMessageModalContent] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [emptySearch, setEmptySearch] = useState(false)

  const [getShopDetails, {error, loading}] = useLazyQuery(GET_SHOP_DETAILS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        id: route.params.id
      }
    },
    onCompleted: (response) => {
      if(response.getShopDetails){
        setStoreData(response.getShopDetails)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const [searchShopProduct, {error2, loading2}] = useLazyQuery(SEARCH_SHOP_PRODUCT, {
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
    getShopDetails()
  }, [])

  const RenderContent = () => {
    return (
      <>
        <Tab 
          index={activeTab} 
          onTabChange={(index) => {
            setActiveTab(index)
            setShowCategories(false)
          }}
        />

        {
          activeTab == 0 && 
          <Product
            paginate={true} 
            data={storeData?.products ? storeData.products : []} 
          />
        }
        {
          activeTab == 1 && 
          !showCategories && 
          <Dropdown 
            onSelect={() => setShowCategories(true)} 
          />
        }
        {
          activeTab == 1 && 
          showCategories && 
          <Product 
            data={storeData?.products ? storeData.products : []} 
          />
        }
      </>
    )
  }

  return (
    <View style={{flex: 1, backgroundColor: "#fff"}}>
      <View style={{flex: 1}}>

        <LandingSubHeader  
          placeholder="Search in Store"
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

        {!error && !loading && searchValue == "" && 
        <Store 
          data={{
            ...storeData,
            rating: 4.0,
            chatResponse: 40,
            followers: 40,
            totalProducts: 152
          }}
          onToggleFollow={(val) => {
            if(val == false){
              //Unfollow
              setMessageModalContent(`You unfollowed ${storeData?.shopname}`)   
            }
            else if(val == true){
              //Followed
              setMessageModalContent(`You are now following ${storeData?.shopname}`)              
            } 
            setMessageModalShown(true)
          }} 
        />}

        {
          !error && 
          !loading && 
          searchValue == "" && 
          <RenderContent />
        }
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

        {messageModalShown && 
        <MessageModal
          type="success"  
          isVisible={messageModalShown}
          setIsVisible={(val) => setMessageModalShown(val)}
          message={messageModalContent}
        />}

      </View>
    </View>
  );
};
