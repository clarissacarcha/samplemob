import React, {useState, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import Toast from 'react-native-simple-toast';
import {LandingSubHeader, Dropdown, MessageModal} from '../../../Components';
import {Tab, Store, Product} from './components';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import { GET_SHOP_DETAILS, SEARCH_SHOP_PRODUCT } from '../../../../graphql/toktokmall/model';
import { useLazyQuery } from '@apollo/react-hooks';
import Spinner from 'react-native-spinkit';
import {ApiCall, PaypandaApiCall, BuildPostCheckoutBody, BuildTransactionPayload, WalletApiCall} from "../../../helpers";
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

export const ToktokMallStore = ({navigation, route}) => {

  const [searchedProducts, setSearchedProducts] = useState([])
  const [storeData, setStoreData] = useState({})
  const [activeTab, setActiveTab] = useState(0)
  const [showCategories, setShowCategories] = useState(false)
  const [messageModalShown, setMessageModalShown] = useState(false)
  const [messageModalContent, setMessageModalContent] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [emptySearch, setEmptySearch] = useState(false)
  const session = useSelector(state=> state.session)
  const [user, setUser] = useState({})

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

  const followShop = async () => {
    let variables = {
      userid: user.userId,
      shopid: storeData.id,
      branchid: '',
    }
    console.log(variables)
    const req = await ApiCall("follow_shop", variables, true)

    if(req.responseData && req.responseData.success == 1){
      setMessageModalContent(`You are now following ${storeData.shopname}`)  
      setMessageModalShown(true) 
    }else if(req.responseError && req.responseError.success == 0){
      Toast.show(req.responseError.message, Toast.LONG)
    }else if(req.responseError){
      Toast.show("Something went wrong", Toast.LONG)
    }else if(req.responseError == null && req.responseData == null){
      Toast.show("Something went wrong", Toast.LONG)
    }
  }

  const unFollowShop = async () => {
    let variables = {
      userid: user.userId,
      shopid: storeData.id,
      branchid: '',
    }
    console.log(variables)
    const req = await ApiCall("unfollow_shop", variables, true)

    if(req.responseData && req.responseData.success == 1){
      setMessageModalContent(`You unfollowed ${storeData.shopname}`)  
      setMessageModalShown(true)   
    }else if(req.responseError && req.responseError.success == 0){
      Toast.show(req.responseError.message, Toast.LONG)
    }else if(req.responseError){
      Toast.show("Something went wrong", Toast.LONG)
    }else if(req.responseError == null && req.responseData == null){
      Toast.show("Something went wrong", Toast.LONG)
    }
  }

  useEffect(() => {
    AsyncStorage.getItem("ToktokMallUser").then((raw) => {
      const data = JSON.parse(raw)
      if(data.userId){
        setUser(data)
      }
    })
    getShopDetails()
  }, [])

  const RenderContent = () => {
    return (
      <>
        {/* <Tab 
          index={activeTab} 
          onTabChange={(index) => {
            setActiveTab(index)
            setShowCategories(false)
          }}
        />

        {
          activeTab == 0 &&  */}
          <Product
            paginate={true} 
            data={storeData?.products ? storeData.products : []} 
          />
        {/* {
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
        } */}
      </>
    )
  }

  return (
    <View style={{flex: 1, backgroundColor: "#fff"}}>
      <View style={{flex: 1}}>

        <LandingSubHeader  
          placeholder="Search in Store"
          initialValue=""
          static={true}
          onPress={() => {
            navigation.navigate("ToktokMallStoreSearch", route.params)
          }}
        />

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

        {!error && !loading && 
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
              unFollowShop()
            }
            else if(val == true){
              //Followed 
              followShop()       
            } 
          }} 
        />}

        {
          !error && 
          !loading && 
          <RenderContent />
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
