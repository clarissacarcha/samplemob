import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity, FlatList, SectionList, StyleSheet, Dimensions, RefreshControl, BackHandler} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import {connect} from 'react-redux';

import { COLOR, FONT } from '../../../../../res/variables';
import {useValues, onScrollEvent} from 'react-native-redash'
import {throttle} from 'lodash';
import FIcon5 from 'react-native-vector-icons/FontAwesome';
import AIcon from 'react-native-vector-icons/MaterialIcons';
import {banner, toktokmallH} from '../../../../assets';
import Animated, {interpolate, Extrapolate, useCode, set} from 'react-native-reanimated'

import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../graphql';
import { GET_CUSTOMER_IF_EXIST } from '../../../../../graphql/toktokmall/model';
import Spinner from 'react-native-spinkit';

import { GET_MY_ACCOUNT, GET_WALLET, GET_USER_TOKTOK_WALLET_DATA } from 'toktokwallet/graphql'

import { GeolocationUtility } from '../../../../util';
import {useFocusEffect} from '@react-navigation/native'


//Main Components
import CustomIcon from '../../../../Components/Icons';
import {LandingHeader, AdsCarousel, StickyHomeHeader, LandingSubHeader} from '../../../../Components';

import {Categories, Offers, FlashSale, Vouchers, Suggestions, Featured} from './Components';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';

const walletIcon = require("src/assets/images/toktokwallet.png");

const SCREEN_WIDTH = Dimensions.get('window').width;

const noWalletModalContent = () => (
  <>
    <Image
      source={walletIcon}
      style={{width: 130, height: 120, resizeMode: 'stretch', overflow: 'hidden'}}
    />
    <View style={{paddingVertical: 2}} />
    <View style={{width: '95%'}}>
      <Text
        style={{
          fontSize: 20,
          fontFamily: FONT.BOLD,
          textAlign: 'center',
          minWidth: '70%',
        }}>
        Use toktokwallet as payment method for faster transaction    
      </Text>
      <Text
        style={{
          fontSize: 14,
          textAlign: 'center',
          marginTop: 10,
          marginBottom: 10,
          minWidth: '70%'
        }}>
        Ordering from your favorite merchants just made easier with toktokmall! For faster transaction, use toktokwallet as your method of payment upon placing of order.
      </Text>
    </View>
  </>
)

// export const ToktokMallLandingScreen = () => {
const Component = ({ myCart, createMyCartSession,}) => {

  const scrollViewRef = useRef(null)
  const [scrolling, setScrolling] = useState(false)
  const [y] = useValues([0], [])
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const session = useSelector(state=> state.session)
  const [scrollendreached, setscrollendreached] = useState(false)

  useEffect(() => {
    console.log(session)
    getWalletAccountStatus()
  }, [])

  useEffect(() => {
    AsyncStorage.getItem('MyCart').then((value) => {
      console.log(value)
      const parsedValue = JSON.parse(value)
      if(value != null){
        createMyCartSession('set', parsedValue)
      }else {
        createMyCartSession('set', [])
      }
    })
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )

  let AnimatedHeaderValue = new Animated.Value(0);
  const animatedHeaderValueRef = useRef(AnimatedHeaderValue)

  const Header_Max_Height = 120;
  const Header_Min_Height = 90;

  const animateHeaderOpacity = animatedHeaderValueRef.current.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  })

  const animateHeaderHeight = animatedHeaderValueRef.current.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [ Header_Max_Height, Header_Min_Height],
    extrapolate: 'clamp'
  })

  const top = animatedHeaderValueRef.current.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [0, -16],
    // extrapolateLeft: Extrapolate.CLAMP
    extrapolate: 'clamp'
  })

  const translatey = animatedHeaderValueRef.current.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [-20, -50],
    // extrapolateLeft: Extrapolate.CLAMP
    extrapolateRight: Extrapolate.CLAMP
  })
  const translateWidth = animatedHeaderValueRef.current.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [SCREEN_WIDTH * .92, SCREEN_WIDTH * .85],
    extrapolate: 'clamp'
    // extrapolateLeft: Extrapolate.CLAMP
    // extrapolateRight: Extrapolate.CLAMP
  })
  const translateLeft = animatedHeaderValueRef.current.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [SCREEN_WIDTH * .04,  SCREEN_WIDTH * .099],
    // extrapolateLeft: Extrapolate.CLAMP
    extrapolateRight: Extrapolate.CLAMP
  })
  
  const onPress = throttle(
    () => {
      navigation.push("ToktokMallSearch");
    },
    1000,
    {trailing: false},
  );

  const onBack = throttle(
    () => {
      navigation.pop();
    },
    1000,
    {trailing: false},
  );
  
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingBottom;
  }

  const  [getWalletAccountStatus] = useLazyQuery(GET_USER_TOKTOK_WALLET_DATA , {
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

      if(!kycStatus){
        dispatch({
          type: 'TOKTOK_MALL_OPEN_MODAL',
          payload: {
            Content: noWalletModalContent,
            actions: [
              {
                onPress: () => {
                  dispatch({type: 'TOKTOK_MALL_CLOSE_MESSAGE_MODAL'});
                },
                name: 'Browse'
              },
              {
                onPress: () => {
                  dispatch({type: 'TOKTOK_MALL_CLOSE_MESSAGE_MODAL'});
                  navigation.push("ToktokWalletLoginPage")
                },
                type: 'fill',
                name: 'Create Account'
              },
            ],
            onCloseDisabled: true
          },
        });
      }     

    },
    onError: (error)=> console.log(error) 
  })


  // const getLocation = async () => {
  //   const currentLocation = await GeolocationUtility.getCurrentLocation();
  //   const {coords} = currentLocation;
  //   return coords;
  // }

  // useEffect(() => {
  //   getLocation().then(async (res) => {
  //     if (res) {
  //       // const {latitude, longitude} = res;
  //       AsyncStorage.setItem("ToktokMallUserCoords", JSON.stringify(res))
  //     }
  //   });
  // }, [])

  return (
    <View style={styles.container}>
      <Animated.View>
        <Animated.Image
          source={banner}
          style={[styles.bannerImage, {height: animateHeaderHeight}]}
        />
        <View style={styles.subContainer}>
          <TouchableOpacity style={styles.leftContainer} onPress = {() => {navigation.pop(2)}}>
            <FIcon5 name="chevron-left" color={COLOR.ORANGE} size={15}/>
          </TouchableOpacity>
          <View style={styles.margin1}></View>
          <View style={styles.TTMHcontainer}>
            <Animated.Image 
              source={toktokmallH} 
              style={[styles.TTMHImage, {opacity: animateHeaderOpacity}]} />
          </View>
          <View style={styles.margin2} />
        </View>

        <TouchableOpacity onPress ={onPress}>
        <Animated.View 
          style={[styles.searchContainer, 
            {
              top: translatey,
              width: translateWidth,
              left: translateLeft
            }
          ]}>
            <AIcon name="search" color={COLOR.ORANGE} size={22}/>
            <Text style={styles.searchText}>Search</Text>
        </Animated.View>
          </TouchableOpacity>

      </Animated.View>

      <Animated.ScrollView
        ref={scrollViewRef}
        style = {[{ top : top}]}
        // refreshControl = {
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={onRefreshData}
        //   />
        // }
        scrollEventThrottle = {16}
        showsVerticalScrollIndicator={false}
        // removeClippedSubviews={true}
        // nestedScrollEnabled={true}
        onScroll = { 
          // Animated.event(
          //   [{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}],
          //   {
          //     useNativeDriver: true
          //   }
          // )
          ({nativeEvent}) => {
            if(isCloseToBottom(nativeEvent)){
              setscrollendreached(true)
            }else{
              setscrollendreached(false)
            }
            Animated.event([{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}], {useNativeDriver: false})
            Animated.event([{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}], {useNativeDriver: false})
            
          }

          //   // animatedHeaderValueRef.setValue(nativeEvent.contentOffset.y)
          // }
      }
        
      >
        <AdsCarousel />
        <Categories  />
        <Featured />
        {/* <Offers  /> */}
        {/* <FlashSale /> */}
        {/* <Vouchers /> */}
        <Suggestions lazyload={scrollendreached} />
      </Animated.ScrollView>

    </View>
  );
};

const mapStateToProps = (state) => ({
  myCart: state.toktokMall.myCart
})

const mapDispatchToProps = (dispatch) => ({
  createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload}),
});

export const ToktokMallLandingScreen = connect(mapStateToProps, mapDispatchToProps)(Component);

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignContent: 'center',
    left: 0,
    right: 0,
    backgroundColor: 'yellow'
  }, 
  headerText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center'
  },
  container: {
    flex: 1, 
    backgroundColor: '#fff'
  },
  bannerImage: {
    width: "100%",
    resizeMode: "stretch",
    width: '100%'
  },
  subContainer: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-end', 
    marginTop: 35, 
    position: 'absolute'
  },
  leftContainer: {
    flex: 0, 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingTop: 8
  },
  margin1: {
    flex: .5
  },
  TTMHcontainer: {
    flex: 10, 
    alignItems: 'center', 
    paddingTop: 15
  },
  TTMHImage: {
    width: '75%',
    height: 35,
    resizeMode: 'cover'
  },
  margin2: {
    flex: 2
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff', 
    alignItems: "center",
    padding: 8, 
    elevation: 8,
    borderRadius: 6,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
    overflow: Platform.OS === "ios" ? 'visible' : 'hidden',
  },
  searchText: {
    color: "darkgray", 
    fontSize: 13, 
    paddingLeft: 5
  },

})