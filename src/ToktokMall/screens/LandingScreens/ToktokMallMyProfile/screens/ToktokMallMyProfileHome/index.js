import React, {useState, useEffect} from 'react';
import {View, Text, ImageBackground, TouchableOpacity, Image, Platform, BackHandler, StyleSheet} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AIcons from 'react-native-vector-icons/dist/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {COLOR, FONT, FONT_SIZE} from '../../../../../../res/variables';
import {Card} from '../../../../../Components'
import CustomIcon from './.../../../../../../../Components/Icons';
import {banner, userIcon, placeholder, deliveredIcon} from '../../../../../assets';
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
    <View style={styles.container}>
      <ImageBackground 
        source={banner}
        imageStyle={styles.imageBackground1}
        style={styles.imageBackground2}
      >
        <View style={styles.subContainer}>
          <View style={styles.profileImageContainer}>
            <Image source={profileImage != "" ? {uri: profileImage} : userIcon} style={styles.profileImage} />
          </View>
          <View style={styles.margin1}></View>
          <View style={styles.userInfoContainer}>
            <Text style={styles.userFullNameText}>{userName}</Text>
            <Text style={styles.userNameText}>{conNo}</Text>
            {userDefaultAddress.fullAddress && <Text style={styles.userAddressText}>{userDefaultAddress.fullAddress}</Text>}
          </View>
          <View style={styles.margin2} />
        </View>            
      </ImageBackground>

      <View style={styles.body}>

        <Card>
          <View style={styles.balanceContainer}>
            <View style={styles.TTWContainer}>
              <Image source={require("../../../../../../assets/toktokwallet-assets/toktokwallet.png")} style={styles.TTWImage} />
            </View>
            <View style={styles.balanceInfoContainer}>
              <Text style={styles.balanceInfoText}>(Balance {FormatToText.currency(toktokMall.toktokWalletBalance)})</Text>
            </View>
            <TouchableOpacity style={styles.paymentOptionsButton(walletAccountStatus)}
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
              <Text style={styles.topupText}>Top up</Text>
            </TouchableOpacity>
          </View>
        </Card>
        
        <View style={styles.margin3} />

        <Card>
          <TouchableOpacity style={styles.addressButton} onPress = {() => {navigation.navigate("ToktokMallAddressesMenu", {
                addressData: testData, screen: 'profile', defaultAddress: 1 })}}>
            <View style={styles.addressTextContainer}>
              <Text style={styles.addressText}>My Addresses</Text>
            </View>
            <View style={styles.rightContainer}>
              <AIcons 
                name = {'right'}
                size = {17}
                color = {COLOR.ORANGE}
              />
            </View>
          </TouchableOpacity>
        </Card>

        <View style={styles.margin4}></View>

        <Card>
          <View style={styles.myOrdersContainer}>
            <View style={styles.myOrdersTextContainer}>
              <Text style={styles.myOrdersText}>My Orders</Text>
            </View>
            <View style={styles.statusContainer}>
              {/* <TouchableOpacity onPress={() => navigation.navigate("ToktokMallActivities", {tab: 0})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.MCIcon name="comment-check-outline" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>Confirmed</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallActivities", {tab: 1})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.FeIcon name="truck" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>To Ship</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallActivities", {tab: 2})} style={{flex: 2,  alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.FeIcon name="package" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>To Receive</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallActivities", {tab: 3})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.MCIcon name="check-all" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>Completed</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallMyOrders", {tab: 3})} style={{flex: 2, alignItems: 'center' , justifyContent: 'center'}}>
                <CustomIcon.MCIcon name="comment-remove-outline" size={30} color={COLOR.ORANGE} />
                <Text style={{fontSize: 12}}>Cancelled</Text>
              </TouchableOpacity> */}

              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallActivities", {tab: 1})} style={styles.statusButton}>
                <CustomIcon.MCIcon name="comment-check-outline" size={30} color={COLOR.ORANGE} />
                <Text style={styles.statusText}>Confirmed</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallActivities", {tab: 2})} style={styles.statusButton}>
                <CustomIcon.FeIcon name="truck" size={30} color={COLOR.ORANGE} />
                <Text style={styles.statusText}>To Ship</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallActivities", {tab: 3})} style={styles.statusButton}>
                <CustomIcon.FeIcon name="package" size={30} color={COLOR.ORANGE} />
                <Text style={styles.statusText}>To Receive</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallActivities", {tab: 4})} style={styles.statusButton}>
                <Image style={{height: 35, width: 35}} source={deliveredIcon} />
                <Text style={styles.statusText}>Completed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        <View style={styles.margin5} />

        <Card>
          <View style={styles.helpCentreContainer}>            
            <View style={styles.helpCentreSubContainer}>
              <View style={styles.flex1} />
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
              <TouchableOpacity onPress={() => navigation.navigate("ToktokMallHelp", {tab: 1})} style={styles.helpCentreButton}>
                <CustomIcon.FeIcon name="help-circle" size={30} color={COLOR.ORANGE} />
                <Text style={styles.helpCentreText}>Help Centre</Text>
              </TouchableOpacity>
              <View style={styles.flex1} />
              {/* <View style={{flex: 2}} /> */}
              {/* <View style={{flex: 1}} /> */}
            </View>
          </View>
        </Card>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff'
  },
  imageBackground1: {
    resizeMode: "stretch", 
    width: '100%'
  },
  imageBackground2: {
    width: "100%", 
    height: Platform.OS == "android" ? 150 : 120
  },
  subContainer: {
    flex: 2, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingTop: Platform.OS == "android" ? 15 : 0, 
    paddingHorizontal: 10
  },
  profileImageContainer: {
    flex: 3, 
    alignItems: 'center'
  },
  profileImage: {
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    resizeMode: 'cover'
  },
  margin1: {
    flex: 0.3
  },
  userInfoContainer: {
    flex: 8
  },
  userFullNameText: {
    fontSize: 15, 
    fontFamily: FONT.BOLD
  },
  userNameText: {
    fontSize: 11, 
    fontWeight: '800'
  },
  userAddressText: {
    fontSize: 11, 
    fontWeight: '800', 
    textTransform: 'capitalize'
  },
  margin2: {
    flex: 0.5
  },
  body: {
    flex: 1, 
    padding: 15, 
    zIndex: 1
  },
  balanceContainer: {
    flexDirection: 'row', 
    padding: 20
  },
  TTWContainer: {
    flex: 4, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  TTWImage: {
    width:'100%', 
    height: 20, 
    resizeMode: 'stretch'
  },
  balanceInfoContainer: {
    flex: 4, 
    alignItems: 'flex-start', 
    justifyContent: 'center'
  },
  balanceInfoText: {
    fontSize: 11, 
    marginLeft: 8, 
    color: COLOR.DARK
  },
  paymentOptionsButton: (walletAccountStatus) => {
    return {
      display: walletAccountStatus == 1 ? 'flex' : 'none', 
      flex: 2, 
      alignItems: 'flex-end', 
      justifyContent: 'center'
    }
  },
  topupText: {
    fontSize: 13, 
    fontFamily: FONT.REGULAR, 
    color: COLOR.ORANGE
  },
  margin3: {
    height: 15
  },
  addressButton: {
    flexDirection: 'row', 
    padding: 20
  },
  addressTextContainer: {
    flex: 4, 
    justifyContent: 'center'
  },
  addressText: {
    fontFamily: FONT.BOLD, 
    fontSize: 14
  },
  rightContainer: {
    flex: 2, 
    alignItems: 'flex-end', 
    justifyContent: 'center'
  },
  margin4: {
    height: 15
  },
  myOrdersContainer: {
    paddingVertical: 10
  },
  myOrdersTextContainer: {
    paddingVertical: 10, 
    paddingHorizontal: 20
  },
  myOrdersText: {
    fontFamily: FONT.BOLD, 
    fontSize: 14
  },
  statusContainer: {
    flexDirection: 'row', 
    paddingVertical: 10
  },
  statusButton: {
    flex: 2, 
    alignItems: 'center' , 
    justifyContent: 'center'
  },
  statusText: {
    fontSize: 12
  },
  margin5: {
    height: 15
  },
  helpCentreContainer: {
    paddingVertical: 10
  },
  helpCentreSubContainer: {
    flexDirection: 'row', 
    paddingVertical: 10
  },
  flex1: {
    flex: 1
  },
  helpCentreButton: {
    flex: 2, 
    alignItems: 'center' , 
    justifyContent: 'center'
  },
  helpCentreText: {
    fontSize: 12
  },
})