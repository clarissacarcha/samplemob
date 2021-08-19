import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  AsyncStorage,
} from 'react-native';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import SplashImage from '../assets/images/toktokmall-splash-screen.png';
import {useSelector} from 'react-redux';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../graphql';
import { TOKTOK_MALL_AUTH_GRAPHQL_CLIENT } from '../../graphql';
import { GET_CUSTOMER_IF_EXIST } from '../../graphql/toktokmall/model';
import {GET_SIGNATURE} from '../../graphql/toktokmall/virtual';
import axios from 'axios';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';

const imageWidth = Dimensions.get('screen').width;
const imageHeight = Dimensions.get('screen').height;

const Splash = ({ createMyCartSession, createNotificationsSession}) => {

  const session = useSelector(state=> state.session)
  const navigation = useNavigation();
	const [loading, setloading] = useState(true);

  // useEffect(() => {
  //   AsyncStorage.getItem('MyCart').then((value) => {
  //     console.log('cart async storage',value)
  //     const parsedValue = JSON.parse(value)
  //     if(value != null){
  //       createMyCartSession('set', parsedValue)
  //       navigation.navigate("ToktokMallLanding");

  //     }else {
  //       createMyCartSession('set', [])
  //       navigation.navigate("ToktokMallLanding");
  //     }
  //   })
  // }, []);

  const [authUser, { error}] = useLazyQuery(GET_CUSTOMER_IF_EXIST, {
		client: TOKTOK_MALL_GRAPHQL_CLIENT,
		fetchPolicy: "network-only",
    variables: {
      input: {
        toktokId: parseInt(session?.user?.id)
        // toktokId: 1234
      }
    },
		onCompleted: async (response) => {

      if(response.getCustomerIfExist){

        if(response.getCustomerIfExist.id != null){

          //Already exist
          await AsyncStorage.setItem("ToktokMallUser", JSON.stringify(response.getCustomerIfExist))
          console.log("User already exist!", response.getCustomerIfExist)     
          await navigation.navigate("ToktokMallLanding")

        }else if(response.getCustomerIfExist.id == null){

          //SEND REQUEST
          console.log("User not registered, registering...")
          await RegisterUser(response.getCustomerIfExist.appSignature)    

        }
        
      }
    },
    onError: (err) => {
      console.log(err)
      // authUser()
    }
	})  

  const RegisterUser = async (signature) => {

    let body = {
      firstname: session?.user.person.firstName,
      lastname: session?.user.person.lastName,
      toktokid: session?.user.id,
      contactnumber: session?.user.username,
      email: session?.user.person.emailAddress,
      address: session?.user.person.address || "NA",
      birthday: moment(session?.user.person.birthdate).format("Y-m-d") || new Date(),
      gender: session?.user.person.gender || "NA"
    }

    let formData = new FormData()
    formData.append("signature", signature)
    formData.append("data", JSON.stringify(body))
    await axios
      .post("http://ec2-18-176-178-106.ap-northeast-1.compute.amazonaws.com/toktokmall/create_user", formData)
      .then((response) => {
        
        if(response.data && response.data.success == 1){
          authUser()
        }else{
         console.log("Response", response.data) 
        }
        
      })
      .catch((error) => {
        console.log(error)
    })

  }

  const FetchAsyncStorageData = async () => {

    //CART
    await AsyncStorage.getItem('MyCart').then((value) => {
      // console.log('cart async storage',value)
      const parsedValue = JSON.parse(value)
      if(value != null){
        createMyCartSession('set', parsedValue)
      }else {
        createMyCartSession('set', [])
      }
    })

    //NOTIFICATION
    await AsyncStorage.getItem('Notifications').then((value) => {
      // console.log('Notifications async storage', value)
      const parsedValue = JSON.parse(value)
      if(value != null){
        createNotificationsSession('set', parsedValue)
      }else {
        createNotificationsSession('set', [])
      }
    })

  }

	const init = async () => {

    await authUser()
    await FetchAsyncStorageData()

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
      
      {error && 
      <TouchableOpacity onPress={init} style={{position: 'absolute', bottom: '25%'}}>
        <Text style={{fontSize: 9}}>Server error, reconnect?</Text>
      </TouchableOpacity>}
    </View>
  );
};

const mapDispatchToProps = (dispatch) => ({
  createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload}),
	createNotificationsSession: (action, payload) => dispatch({type: 'CREATE_NOTIFICATIONS_SESSION', action,  payload}),  
});

export default connect(null, mapDispatchToProps)(Splash);

