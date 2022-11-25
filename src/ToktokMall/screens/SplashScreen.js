import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground, 
  TouchableOpacity,
  ToastAndroid
} from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../graphql';
import { GET_CUSTOMER_IF_EXIST, GET_CUSTOMER_RECORDS, GET_MY_CART, GET_ORDERS_NOTIFICATION } from '../../graphql/toktokmall/model';
import { DynamicApiCall } from '../helpers';
import { splashImage, newSplashImage } from '../assets';
import CONSTANTS from '../../common/res/constants';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

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
  const route = useRoute()

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

          console.log("User already exist!", response.getCustomerIfExist)  
          console.log("TOKTOKT RECORD", session?.user.person)

          if(session?.user.person.emailAddress != response.getCustomerIfExist.email){
            //UPDATE CUSTOMER RECORD
            await UpdateUser(response.getCustomerIfExist)
          }

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

          next(response.getCustomerIfExist.userId)

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
        navigation.replace('SuperAppServiceMaintenance', {service: 'MALL'});
        setFailed(true)
      }
    },
    onError: (err) => {
      console.log(err)
      setFailed(true)
      navigation.replace('SuperAppServiceMaintenance', {service: 'MALL'});
      // authUser()
    }
	})  

  const RegisterUser = async (signature) => {

    let variables = {
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
    const req = await DynamicApiCall("create_user", signature, variables, {debug: true})

    if(req.responseData && req.responseData.success == 1){
      setRegisterRetries(1)
      authUser()
    }else if(req.responseError && req.responseError.success == 0){
      navigation.replace('SuperAppServiceMaintenance', {service: 'MALL'});
      setFailed(true)
      Toast.show(req.responseError.message, Toast.LONG)
    }else if(req.responseError){
      navigation.replace('SuperAppServiceMaintenance', {service: 'MALL'});
      setFailed(true)
      Toast.show("Something went wrong", Toast.LONG)
    }else if(req.responseError == null && req.responseData == null){
      navigation.replace('SuperAppServiceMaintenance', {service: 'MALL'});
      setFailed(true)
      Toast.show("Something went wrong", Toast.LONG)
    }
  }

  const UpdateUser = async ({userId, appSignature}) => {

    let variables = {
      firstname: session?.user.person.firstName,
      lastname: session?.user.person.lastName,
      user_id: userId,
      contactnumber: session?.user.person.mobileNumber,
      email: session?.user.person.emailAddress,
      address: session?.user.person.address || "NA",
      birthday: session?.user.person.birthdate ? moment(session?.user.person.birthdate).format("Y-m-d") : "",
      gender: session?.user.person.gender || "N"
    }
    const req = await DynamicApiCall("updateCustomerProfile", appSignature, variables, {debug: true})
    if(req.responseData && req.responseData.success == 1){
      setRegisterRetries(1)
      authUser()
    }else if(req.responseError && req.responseError.success == 0){
      navigation.replace('SuperAppServiceMaintenance', {service: 'MALL'});
      setFailed(true)
      ToastAndroid.show(req.responseError.message, ToastAndroid.LONG)
    }else if(req.responseError){
      navigation.replace('SuperAppServiceMaintenance', {service: 'MALL'});
      setFailed(true)
      ToastAndroid.show("Something went wrong", ToastAndroid.LONG)
    }else if(req.responseError == null && req.responseData == null){
      navigation.replace('SuperAppServiceMaintenance', {service: 'MALL'});
      setFailed(true)
      ToastAndroid.show("Something went wrong", ToastAndroid.LONG)
    }
  }

  const next = async (userId) => {
    await AsyncStorage.getItem("ToktokMallUserOnboard").then((res) => {
      console.log(res)
      if(!res){
        //WELCOME
        navigation.navigate("ToktokMallOnBoarding", {userId})
      }else if(res){
        let data = JSON.parse(res)
        if(data?.userId == userId){
          //SAME USER
          navigation.navigate("ToktokMallLanding")
        }else{
          //NEW USER ACCOUNT
          navigation.navigate("ToktokMallOnBoarding", {userId})
        }
      }
    })
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
      const parsedValue = JSON.parse(value)
      if(value != null){
        createMyCartSession('set', parsedValue)
      }else {
        createMyCartSession('set', [])
      }
    })

    //DEFAULT ADDRESS
    await AsyncStorage.getItem('ToktokMallUserDefaultAddress').then((value) => {
      const parsedValue = JSON.parse(value)
      if(value != null){
        createDefaultAddressSession('set', parsedValue)
      }else {
        createDefaultAddressSession('set', {})
      }
    })

    //NOTIFICATION
    await AsyncStorage.getItem('ToktokMallNotifications').then((value) => {
      const parsedValue = JSON.parse(value)
      if(value != null){
        createNotificationsSession('set', parsedValue)
      }else {
        createNotificationsSession('set', [])
      }
    })

    //SEARCH HISTORY
    await AsyncStorage.getItem('ToktokMallSearchHistory').then((value) => {
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
    authUser()
	}

	useEffect(() => {

    console.log("Deep Link:", route?.params)
    // return
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
    <View style={styles.container}>
      {/* <Image 
				source={splashImage} 
				style={styles.splashImage} 
				resizeMode="cover" 
			/> */}

      <Image 
        source={newSplashImage}
        style={styles.newSplashImage}
      />

      {failed && 
      <View style={styles.subContainer}>
        <View style={styles.unableContainer}>
          <Text style={styles.unableText}>Unable to connect to server. </Text>
        </View>
        <TouchableOpacity onPress={init} style={styles.tryAgainContainer}>
          <Text style={styles.tryAgainButton}> Try again</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent:'center', 
    alignItems: 'center',
    backgroundColor: CONSTANTS.COLOR.BACKGROUND_YELLOW
  },
  splashImage: {
    height: '100%', 
    width: '100%' 
  },
  newSplashImage: {
    height: 150,
    resizeMode: 'contain'
  },
  subContainer: {
    position:'absolute', 
    bottom: '34%'
  },
  unableContainer: {
    alignItems: 'center'
  },
  unableText: {
    fontSize: 12, 
    textAlign: 'center'
  },
  tryAgainContainer: {
    alignItems: 'center'
  },
  tryAgainButton: {
    fontSize: 14, 
    color: "#F6841F"
  },
})

