import React, {useState, useEffect} from 'react';
import {View, Text, ImageBackground, TouchableOpacity, Image, Platform, BackHandler} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AIcons from 'react-native-vector-icons/dist/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {COLOR, FONT, FONT_SIZE} from '../../../../../../res/variables';
import {Card} from '../../../../../Components'
import CustomIcon from './.../../../../../../../Components/Icons';
import {banner, userIcon, placeholder} from '../../../../../assets';
import AsyncStorage from '@react-native-community/async-storage';
import {FormatToText} from '../../../../../helpers';

import { 
  TOKTOK_MALL_GRAPHQL_CLIENT
} from '../../../../../../graphql';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_DEFAULT_ADDRESS } from '../../../../../../graphql/toktokmall/model';

import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_MY_ACCOUNT, GET_WALLET, GET_USER_TOKTOK_WALLET_DATA } from 'toktokwallet/graphql'

import {useFocusEffect} from '@react-navigation/native'
import { EventRegister } from 'react-native-event-listeners';

const testData = [
  {id: 1, full_name: 'Cloud Panda', contact_number: '09050000000',
    address: '10F, Inoza Tower, 40th Street, Bonifacio Global City', default: 1
  },
  {id: 2, full_name: 'Rick Sanchez', contact_number: '09060000000',
    address: 'B20 L1, Mahogany Street, San Isidro, Makati City', default: 0
  }
]

export const ToktokMallMyProfileHome = ({navigation}) => {

  const session = useSelector(state=> state.session)
  const toktokMall = useSelector(state=> state.toktokMall)
  const dispatch = useDispatch()
  const userDefaultAddress = useSelector(state => state.toktokMall.defaultAddress)
  const [profileImage, setProfileImage] = useState("")
  const [userName, setUserName] = useState("")
  const [conNo, setConNo] = useState("")
  const [address, setAddress] = useState("")
  const [accountBalance, setAccountBalance] = useState(0)
  const [walletAccountStatus, setWalletAccountStatus] = useState(null)

  const [getDefaultAddress, {error, loading}] = useLazyQuery(GET_DEFAULT_ADDRESS, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: async (response) => {
      if(response.getDefaultCustomerAddress){
        setAddress(response.getDefaultCustomerAddress.fullAddress)
        console.log("Full Address", response.getDefaultCustomerAddress.fullAddress)
      }
    },
    onError: (err) => console.log(err),
  });

  const [ getMyAccount ] = useLazyQuery(GET_MY_ACCOUNT , {
    fetchPolicy: "network-only",
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({ getMyAccount })=> {
      // do something with result
      console.log(getMyAccount)
  },
  onError: (error) => {
    console.log(error)
  }
  })

  const  [getToktokWalletData] = useLazyQuery(GET_USER_TOKTOK_WALLET_DATA , {
    fetchPolicy:"network-only",
    variables: {
      input: {
        userId: session.user.id,
      }
    },
    onCompleted: async ({getUserToktokWalletData})=> {
      console.log(getUserToktokWalletData)
      const {kycStatus} = getUserToktokWalletData
      console.log("kycStatus", kycStatus)
      setWalletAccountStatus(kycStatus)
    },
    onError: (error)=> console.log(error) 
  })

  const [ getWallet ] = useLazyQuery(GET_WALLET , {
    fetchPolicy: "network-only",
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({ getWallet })=> {
      // do something with result
      console.log(getWallet)
      console.log(getWallet.balance)

      dispatch({ type: "TOKTOK_MALL_SET_TOKTOK_WALLET_BALANCE", payload: getWallet.balance})
      setAccountBalance(getWallet.balance)
  },
  onError: (error) => {
    console.log(error)
    getToktokWalletData()
  }
  })
  

  useEffect(() => {
    const user = session?.user.person || {}
    setUserName(`${user.firstName} ${user.lastName}`)
    setProfileImage(user.avatarThumbnail)
    setConNo(session?.user.username)

    getToktokWalletData()
    getWallet()
    EventRegister.addEventListener("ToktokMallWalletRefreshAccountBalance", getWallet)

    // AsyncStorage.getItem("ToktokMallUser").then((raw) => {
    //   let data = JSON.parse(raw)
    //   if(data.userId){
    //     getDefaultAddress({variables: {
    //       input: {
    //         userId: data.userId
    //       }
    //     }})
    //   }
    // })

  }, [])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("ToktokMallLanding", {screen: "ToktokMallMyProfile"})
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ImageBackground 
        source={banner}
        imageStyle={{ resizeMode: "stretch", width: '100%'}}
        style={{width: "100%", height: Platform.OS == "android" ? 150 : 120}}
      >
        <View style={{flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: Platform.OS == "android" ? 15 : 0, paddingHorizontal: 10}}>
          <View style={{flex: 3, alignItems: 'center'}}>
            <Image source={profileImage != "" ? {uri: profileImage} : userIcon} style={{width: 80, height: 80, borderRadius: 40, resizeMode: 'cover'}} />
          </View>
          <View style={{flex: 0.3}}></View>
          <View style={{flex: 8}}>
            <Text style={{fontSize: 15, fontFamily: FONT.BOLD}}>{userName}</Text>
            <Text style={{fontSize: 11, fontWeight: '800'}}>{conNo}</Text>
            {userDefaultAddress.fullAddress && <Text style={{fontSize: 11, fontWeight: '800', textTransform: 'capitalize'}}>{userDefaultAddress.fullAddress}</Text>}
          </View>
          <View style={{flex: 0.5}} />
        </View>            
      </ImageBackground>

      <View style={{flex: 1, padding: 15, zIndex: 1}}>

        <Card>
          <View style={{flexDirection: 'row', padding: 20}}>
            <View style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
              <Image source={require("../../../../../../assets/toktokwallet-assets/toktokwallet.png")} style={{width:'100%', height: 20, resizeMode: 'stretch'}} />
            </View>
            <View style={{flex: 4, alignItems: 'flex-start', justifyContent: 'center'}}>
              <Text style={{fontSize: 11, marginLeft: 8, color: COLOR.DARK}}>(Balance {FormatToText.currency(toktokMall.toktokWalletBalance)})</Text>
            </View>
            <TouchableOpacity style={{display: walletAccountStatus == 1 ? 'flex' : 'none', flex: 2, alignItems: 'flex-end', justifyContent: 'center'}}
              onPress = {() => {

                navigation.navigate("ToktokWalletPaymentOptions" , {
                  amount: 1000,
                   onCashIn: ({balance}) => {
                      getWallet()
                    //  setAccountBalance(balance)
                    //  dispatch({ type: "TOKTOK_MALL_SET_TOKTOK_WALLET_BALANCE", payload: balance})
                   },
                })                

              }}
            >
              <Text style={{fontSize: 13, fontFamily: FONT.REGULAR, color: COLOR.ORANGE}}>Top up</Text>
            </TouchableOpacity>
          </View>
        </Card>
        
        <View style={{height: 15}}></View>

        <Card>
          <TouchableOpacity style={{flexDirection: 'row', padding: 20}} onPress = {() => {navigation.navigate("ToktokMallAddressesMenu", {
                addressData: testData, screen: 'profile', defaultAddress: 1 })}}>
            <View style={{flex: 4,  justifyContent: 'center'}}>
              <Text style={{fontFamily: FONT.BOLD, fontSize: 14}}>My Addresses</Text>
            </View>
            <View style={{flex: 2, alignItems: 'flex-end', justifyContent: 'center'}}>
              <AIcons 
                name = {'right'}
                size = {17}
                color = {COLOR.ORANGE}
              />
            </View>
          </TouchableOpacity>
        </Card>

        <View style={{height: 15}}></View>

        <Card>
          <View style={{paddingVertical: 10 }}>
            <View style={{paddingVertical: 10, paddingHorizontal: 20}}>
              <Text style={{fontFamily: FONT.BOLD, fontSize: 14}}>My Orders</Text>
            </View>
            <View style={{flexDirection: 'row', paddingVertical: 10}}>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallMyOrders", {tab: 0})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                {/* <CustomIcon.FeIcon name="box" size={30} color={COLOR.ORANGE} /> */}
                <CustomIcon.MCIcon name="comment-check-outline" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>Confirmed</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallMyOrders", {tab: 1})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.FeIcon name="truck" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>To Ship</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallMyOrders", {tab: 2})} style={{flex: 2,  alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.FeIcon name="package" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>To Receive</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallMyOrders", {tab: 3})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.MCIcon name="check-all" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>Completed</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => navigation.navigate("ToktokMallMyOrders", {tab: 3})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.MCIcon name="comment-remove-outline" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>Cancelled</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </Card>

        <View style={{height: 15}}></View>

        <Card>
          <View style={{paddingVertical: 10 }}>            
            <View style={{flexDirection: 'row', paddingVertical: 10}}>
              <View style={{flex: 1}} />
              {/* <TouchableOpacity onPress={() => navigation.navigate("ToktokMallMyWishlist", {tab: 1})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.EIcon name="heart-outlined" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>Favorites</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallMyFollowing", {tab: 1})} style={{flex: 2,  alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.AIcon name="home" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>Following</Text>
              </TouchableOpacity> */}
              {/* <TouchableOpacity onPress={() => navigation.navigate("ToktokMallMyVouchers", {tab: 1})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.MCIcon name="ticket-outline" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>My Vouchers</Text>
              </TouchableOpacity> */}
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallHelp", {tab: 1})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.FeIcon name="help-circle" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>Help Centre</Text>
              </TouchableOpacity>
              <View style={{flex: 1}} />
              {/* <View style={{flex: 2}} /> */}
              {/* <View style={{flex: 1}} /> */}
            </View>
          </View>
        </Card>

      </View>

    </View>
  );
};
