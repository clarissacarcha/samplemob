import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity, FlatList, SectionList, StyleSheet, Dimensions, AsyncStorage, RefreshControl} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
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

//Main Components
import CustomIcon from '../../../../Components/Icons';
import {LandingHeader, AdsCarousel, StickyHomeHeader, LandingSubHeader} from '../../../../Components';

import {Categories, Offers, FlashSale, Vouchers, Suggestions, Featured} from './Components';

const SCREEN_WIDTH = Dimensions.get('window').width;

// export const ToktokMallLandingScreen = () => {
const Component = ({ myCart, createMyCartSession,}) => {

  const scrollViewRef = useRef(null)
  const [scrolling, setScrolling] = useState(false)
  const [y] = useValues([0], [])
  const navigation = useNavigation();
  const session = useSelector(state=> state.session)
  const [scrollendreached, setscrollendreached] = useState(false)
  
  // const {data, loading, error} = useQuery(GET_CUSTOMER_IF_EXIST, {
  //   client: TOKTOK_MALL_GRAPHQL_CLIENT,
  //   fetchPolicy: 'network-only',
  //   variables: {
  //     input: {
  //       mobile: session.user.username,
  //       email: session.user.person.emailAddress
  //     },
  //   },
  // });

  useEffect(() => {
    console.log(session)
  }, [])

  // const HandleOnScroll = (r) => {
  //   let ypos = r.nativeEvent.contentOffset.y
  //   if(ypos > 100) setScrolling(true)
  //   else if (ypos <= 100) setScrolling(false)
  // }

  useEffect(() => {
    AsyncStorage.getItem('MyCart').then((value) => {
      console.log(value)
      const parsedValue = JSON.parse(value)
      if(value != null){
        createMyCartSession('set', parsedValue)
      }else {
        createMyCartSession('set', testdata)
      }
    })
  }, []);

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

  // if(loading) {
  //   return (
  //     <>
  //       <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
  //         <Spinner 
  //           isVisible={loading}
  //           type='Circle'
  //           color={"#F6841F"}
  //           size={35}
  //         />
  //       </View>
  //     </>
  //   )
  // }

  // if(error){
  //   return (
  //     <>
  //       <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
  //         <Text>Something went wrong...</Text>
  //       </View>
  //     </>
  //   )
  // }
  
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingBottom = 0;
    // console.log(layoutMeasurement.height + contentOffset.y, contentSize.height - paddingBottom)
    return layoutMeasurement.height + contentOffset.y == contentSize.height - paddingBottom;
  }

  const onScroll = (event) => {
    // alert
    // if(isCloseToBottom(event)){
    //   alert('close to bottom')
    // }
    // console.log(event.nativeEvent)
    if(isCloseToBottom(event.nativeEvent)){
      alert('close to bottom')
    }
    // Animated.event(
    //   [{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}],
    //   {useNativeDriver: false}
    // )
  }

  const onRefreshData = async () => {
    setRefreshing(true);
    let sampleArr = []
    if(suggestionsArr.length < 30){
      for (let x = 0; suggestionsArr.length > x; x++){
        sampleArr.push(suggestionsArr[x])
      }
      for (let x = 0; suggestionsArr2.length > x; x++){
        sampleArr.push(suggestionsArr2[x])
      }
    }
    setSuggestionsArr(sampleArr)
    console.log(sampleArr)
    setRefreshing(false)
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Animated.View>
        <Animated.Image
          source={banner}
          style={[
            {
              width: "100%",
              resizeMode: "stretch",
              width: '100%'
            }, 
            {
              height: animateHeaderHeight
            }
          ]}
        />
        <View style={[{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 35, position: 'absolute'}]}>
          <View style={{flex: 0, alignItems: 'center', paddingHorizontal: 15, paddingTop: 8}}>
            <FIcon5 name="chevron-left" color={COLOR.ORANGE} size={15}/>
          </View>
          <View style={{flex: .5}}></View>
          <View style={{flex: 10, alignItems: 'center', paddingTop: 15}}>
            <Animated.Image 
              source={toktokmallH} 
              style={[
                {
                  width: '75%',
                  height: 35,
                  resizeMode: 'stretch'
                },
                {
                  opacity: animateHeaderOpacity
                }
              ]} />
          </View>
          <View style={{flex: 2}} />
        </View>

        <TouchableOpacity onPress ={onPress}>
        <Animated.View 
          style={[
            {
              flexDirection: 'row',
              backgroundColor: '#fff', 
              alignItems: "center",
              padding: 8, 
              elevation: 8,
              borderRadius: 6
            }, 
            {
              top: translatey,
              width: translateWidth,
              left: translateLeft
            }
          ]}>
            <AIcon name="search" color={COLOR.ORANGE} size={22}/>
            <Text style={{color: "darkgray", fontSize: 13, paddingLeft: 5}}>Search</Text>
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
        removeClippedSubviews={true}
        nestedScrollEnabled={true}
        onScroll = { 
          // Animated.event(
          //   [{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}],
          //   {
          //     useNativeDriver: true
          //   }
          // )
          ({nativeEvent}) => {
            Animated.event([{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}], {useNativeDriver: false})
            Animated.event([{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}], {useNativeDriver: false})
            if(isCloseToBottom(nativeEvent)){
              setscrollendreached(true)
            }else{
              setscrollendreached(false)
            }
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
  }
})