import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground, 
  TouchableOpacity
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import SplashImage from '../assets/images/toktokmall-splash-screen.png';
import {useSelector} from 'react-redux';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../graphql';
import { TOKTOK_MALL_AUTH_GRAPHQL_CLIENT } from '../../graphql';
import { GET_CUSTOMER_IF_EXIST, GET_CUSTOMER_RECORDS, GET_MY_CART, GET_ORDERS_NOTIFICATION } from '../../graphql/toktokmall/model';
import {GET_SIGNATURE} from '../../graphql/toktokmall/virtual';
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import { EventRegister } from 'react-native-event-listeners';
import { DynamicApiCall } from '../helpers';


const imageWidth = Dimensions.get('screen').width;
const imageHeight = Dimensions.get('screen').height;

const Splash = ({ 
  createMyCartSession, 
  createNotificationsSession, 
  createDefaultAddressSession,
  createSearchHistorySession,
  createMyCartCountSession,
  createNotificationCountSession
}) => {

  const session = useSelector(state=> state.session)
  const navigation = useNavigation();
	const [loading, setloading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [registerRetries, setRegisterRetries] = useState(0);
	const [orderHistory, setOrderHistory] = useState([])
  const dispatch = useDispatch()

  const [authUser, { error}] = useLazyQuery(GET_CUSTOMER_IF_EXIST, {
		client: TOKTOK_MALL_GRAPHQL_CLIENT,
		fetchPolicy: "network-only",
    variables: {
      input: {
        toktokId: parseInt(session?.user?.id)
        // toktokId: 12345
      }
    },
		onCompleted: async (response) => {

      if(response.getCustomerIfExist){

        if(response.getCustomerIfExist.id != null){

          //Already exist
          await AsyncStorage.setItem("ToktokMallUser", JSON.stringify(response.getCustomerIfExist))

        getMyCartData({
          variables: {
            input: {
              userId: response.getCustomerIfExist.userId
            }
          }
        })

        getOrderNotifications({
          variables: {
            input: {
              userId: response.getCustomerIfExist.userId
            }
          }
        })

          console.log("User already exist!", response.getCustomerIfExist)  
          await navigation.navigate("ToktokMallLanding")

        }else if(response.getCustomerIfExist.id == null){

          if(registerRetries == 0){
            //SEND REQUEST
            console.log("User not registered, registering...")
            await RegisterUser(response.getCustomerIfExist.appSignature)
          }else{
            //ALREADY TRIED REGISTERING BUT DIDNT REFLECTED ON app_customers table
            console.log("Register attemp succeed but not reflected on app_customers table")
            setFailed(true)
          }

        }

        setFailed(false)
        
      }else{
        setFailed(true)
      }
    },
    onError: (err) => {
      console.log(err)
      setFailed(true)
      // authUser()
    }
	})  

  const RegisterUser = async (signature) => {

    let body = {
      firstname: session?.user.person.firstName,
      lastname: session?.user.person.lastName,
      // userid: session?.user.id,
      toktokid: parseInt(session?.user.id), 
      contactnumber: session?.user.username,
      email: session?.user.person.emailAddress,
      address: session?.user.person.address || "NA",
      birthday: session?.user.person.birthdate ? moment(session?.user.person.birthdate).format("Y-m-d") : "",
      gender: session?.user.person.gender || "NA"
    }

    try{

      const {responseData, responseError} = await DynamicApiCall("create_user", signature, body)      
      
      if(responseData && responseData.success == 1){
        // console.log("Response", responseData) 
        setRegisterRetries(1)
        authUser({
          variables: {
            input: {
              toktokId: parseInt(responseData.user_id)
            }
          }
        })
      }else{
        setFailed(true)
       console.log("Response", responseData) 
       console.log("Response Error", responseError)
      }
    }catch(err){
      console.log(err)
    }

    return

  }

  const [getCustomerRecords, {error2, loading2}] = useLazyQuery(GET_CUSTOMER_RECORDS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
		fetchPolicy: "network-only",
    onCompleted: async ({getCustomerRecords}) => {
      if(getCustomerRecords){
        createMyCartCountSession("set", getCustomerRecords.cart)
        createNotificationCountSession("set", getCustomerRecords.notifications)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const FetchAsyncStorageData = async () => {

    //CART
    await AsyncStorage.getItem('ToktokMallMyCart').then((value) => {
      // console.log('cart async storage',value)
      const parsedValue = JSON.parse(value)
      if(value != null){
        createMyCartSession('set', parsedValue)
      }else {
        createMyCartSession('set', [])
      }
    })

    //DEFAULT ADDRESS
    await AsyncStorage.getItem('ToktokMallUserDefaultAddress').then((value) => {
      // console.log('Notifications async storage', value)
      const parsedValue = JSON.parse(value)
      if(value != null){
        createDefaultAddressSession('set', parsedValue)
      }else {
        createDefaultAddressSession('set', {})
      }
    })

    //NOTIFICATION
    await AsyncStorage.getItem('ToktokMallNotifications').then((value) => {
      // console.log('Notifications async storage', value)
      const parsedValue = JSON.parse(value)
      if(value != null){
        createNotificationsSession('set', parsedValue)
      }else {
        createNotificationsSession('set', [])
      }
    })

    //SEARCH HISTORY
    await AsyncStorage.getItem('ToktokMallSearchHistory').then((value) => {
      // console.log('Notifications async storage', value)
      const parsedValue = JSON.parse(value)
      if(value != null){
        createSearchHistorySession('set', parsedValue)
      }else {
        createSearchHistorySession('set', [])
      }
    })    

  }

  const [getMyCartData] = useLazyQuery(GET_MY_CART, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',    
    onCompleted: (response) => {
      if(response.getMyCart){
        let count = 0;
        response.getMyCart.parsed.map(({data}) => data.map(item => (item.product.enabled === 1 && item.product.noOfStocks !== 0) && (count+=item.quantity)))
        dispatch({ type: "TOKTOK_MALL_CART_COUNT", action: "set", payload: count})

      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const [getOrderNotifications] = useLazyQuery(GET_ORDERS_NOTIFICATION, {
		client: TOKTOK_MALL_GRAPHQL_CLIENT,
		fetchPolicy: 'network-only',
		onCompleted: (response) => {
			if(response.getOrdersNotification){				
        setOrderHistory(response.getOrdersNotification)        
			}
    },
    onError: (err) => {
      console.log(err)
    }
	})
  useEffect(() => {
    //count notifications
    let count = 0
    if(orderHistory.length > 0){
      for(var x=0;x<orderHistory.length;x++){
        let order = orderHistory[x];
        if(order.read == 0) count++
        else count = count
      }
      
      dispatch({ type: "TOKTOK_MALL_NOTIFICATION_COUNT", action: "set", payload: count})    
    }
  }, [orderHistory])

	const init = async () => {
    setFailed(false)
    await FetchAsyncStorageData()
    
    await AsyncStorage.getItem("ToktokMallUser").then(async (raw) => {
      const data = JSON.parse(raw) || null
      console.log("user data", data)
      if(data && data.userId){
        // await getCustomerRecords({
        //   variables: {
        //     input: {
        //       userId: data.userId
        //     }
        //   }
        // })
        getMyCartData({
          variables: {
            input: {
              userId: data.userId
            }
          }
        })
        getOrderNotifications({
          variables: {
            input: {
              userId: data.userId
            }
          }
        })
        setTimeout(() => {
          navigation.navigate("ToktokMallLanding");
        }, 2000);
      }else{
        await authUser()
      }
    }).catch((error) => {
      console.log(error)      
    })

	}

	useEffect(() => {
		
    init()
    
	}, [])

	useEffect(() => {
		if(!loading){
			//Done, navigate to landing page
			// navigation.navigate("ToktokMallLanding");
      console.log("Fetching done ....")
		}
	}, [loading])

  return (
    <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}>
      <Image 
				source={SplashImage} 
				style={{height: '100%', width: '100%' }} 
				resizeMode="cover" 
			/>

      {failed && 
      <View style={{position:'absolute', bottom: '34%'}}>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 12, textAlign: 'center'}}>Unable to connect to server. </Text>
        </View>
        <TouchableOpacity onPress={init} style={{alignItems: 'center'}}>
          <Text style={{fontSize: 14, color: "#F6841F"}}> Try again</Text>
        </TouchableOpacity>
      </View>}

    </View>
  );
};

const mapDispatchToProps = (dispatch) => ({
  createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload}),
	createNotificationsSession: (action, payload) => dispatch({type: 'CREATE_NOTIFICATIONS_SESSION', action,  payload}),  
  createDefaultAddressSession: (action, payload) => dispatch({type: 'CREATE_DEFAULT_ADDRESS_SESSION', action,  payload}),
  createSearchHistorySession: (action, payload) => dispatch({type: 'CREATE_SEARCH_HISTORY_SESSION', action,  payload}),
  createMyCartCountSession: (action, payload) => dispatch({type: 'TOKTOK_MALL_CART_COUNT', action, payload}),
  createNotificationCountSession: (action, payload) => dispatch({type: 'TOKTOK_MALL_NOTIFICATION_COUNT', action, payload}),
});

export default connect(null, mapDispatchToProps)(Splash);

