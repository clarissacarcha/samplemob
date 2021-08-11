import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity, FlatList, SectionList, StyleSheet, Dimensions, AsyncStorage, RefreshControl} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';

import { COLOR, FONT } from '../../../../../res/variables';
import {useValues, onScrollEvent} from 'react-native-redash'
import {throttle} from 'lodash';
import FIcon5 from 'react-native-vector-icons/FontAwesome';
import AIcon from 'react-native-vector-icons/MaterialIcons';
import {banner, toktokmallH} from '../../../../assets';
import Animated, {interpolate, Extrapolate, useCode, set, greaterThan} from 'react-native-reanimated'

//Main Components
import CustomIcon from '../../../../Components/Icons';
import {LandingHeader, AdsCarousel, StickyHomeHeader, LandingSubHeader} from '../../../../Components';

import {Categories, Offers, FlashSale, Vouchers, Suggestions} from './Components';
import {clothfacemask, medicalfacemask} from '../../../../assets'; 
import {suggestionsArr2} from '../../../../Components/Widgets/datas'
const suggestionsArray = [{
  image: clothfacemask,
  rating: 4,
  price: 190,
  stock: 35,
  sold: 187,
  label: "Cloth Face Mask"
}, {
  image: medicalfacemask,
  rating: 3,
  price: 80,
  stock: 201,
  sold: 407,
  label: "Medical Face Mask"
}, {
  image: clothfacemask,
  rating: 5,
  price: 190,
  stock: 35,
  sold: 187,
  label: "Cloth Face Mask"
}, {
  image: medicalfacemask,
  rating: 2,
  price: 190,
  stock: 35,
  sold: 187,
  label: "Medical Face Mask"
}]

const SCREEN_WIDTH = Dimensions.get('window').width;
const Item = ({ title }) => (
  <View style={{}}>
    <Text style={{}}>{title}</Text>
  </View>
);

export const ToktokMallLandingScreen = () => {
// const Component = ({ myCart, createMyCartSession,}) => {

  const [scrolling, setScrolling] = useState(false)
  const [y] = useValues([0], [])
  const navigation = useNavigation();
  const [refreshing, setRefreshing] =useState(false)
  const [suggestionsArr, setSuggestionsArr] = useState(suggestionsArray)

  // const HandleOnScroll = (r) => {
  //   let ypos = r.nativeEvent.contentOffset.y
  //   if(ypos > 100) setScrolling(true)
  //   else if (ypos <= 100) setScrolling(false)
  // }

  // useEffect(() => {
    // setAllSelected(false)
    // testData2 = myCart
    // setSelectedItemsArr(myCart)
    // AsyncStorage.getItem('MyCart').then((value) => {
    //   console.log(value)
    //   const parsedValue = JSON.parse(value)
    //   if(value != null){
    //     createMyCartSession('set', parsedValue)
    //   }else {
        // createMyCartSession('set', testdata)
    //   }
    // })
  // }, []);

  let AnimatedHeaderValue = new Animated.Value(0);
  const Header_Max_Height = 120;
  const Header_Min_Height = 90;

  const animateHeaderOpacity = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  })

  const animateHeaderHeight = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [ Header_Max_Height, Header_Min_Height],
    extrapolate: 'clamp'
  })

  const top = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [0, -16],
    // extrapolateLeft: Extrapolate.CLAMP
    extrapolate: 'clamp'
  })

  const translatey = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [-20, -50],
    // extrapolateLeft: Extrapolate.CLAMP
    extrapolateRight: Extrapolate.CLAMP
  })
  const translateWidth = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [SCREEN_WIDTH * .92, SCREEN_WIDTH * .85],
    extrapolate: 'clamp'
    // extrapolateLeft: Extrapolate.CLAMP
    // extrapolateRight: Extrapolate.CLAMP
  })
  const translateLeft = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [SCREEN_WIDTH * .04,  SCREEN_WIDTH * .099],
    // extrapolateLeft: Extrapolate.CLAMP
    extrapolateRight: Extrapolate.CLAMP
  })
  
  const onPress = throttle(
    () => {
      navigation.navigate("ToktokMallSearch");
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

        <Animated.View 
          style={[
            {
              flexDirection: 'row',
              backgroundColor: '#fff', 
              padding: 4, 
              elevation: 8,
              borderRadius: 6
            }, 
            {
              top: translatey,
              width: translateWidth,
              left: translateLeft
            }
          ]}>
          <TouchableOpacity style={{flex: 0, paddingHorizontal: 8,  paddingVertical: 4}} onPress ={onPress}>
            <AIcon name="search" color={COLOR.ORANGE} size={22}/>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 0, justifyContent: 'center', paddingVertical: 4}} onPress ={onPress}>
            <Text style={{color: "darkgray", fontSize: 13}}>Search</Text>
          </TouchableOpacity>
        </Animated.View>

      </Animated.View>

      <Animated.ScrollView
        style = {[{ top : top}]}
        refreshControl = {
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshData}

          />
        }
        scrollEventThrottle = {16}
        onScroll = { 
          Animated.event(
            [{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}],
            {
              listener: (event) => {
                onScroll(event)
              },
              useNativeDriver: true
            }
          )
          // ({nativeEvent}) => {
          //   // Animated.event([{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}], {useNativeDriver: false})
          //   Animated.event([{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}], {useNativeDriver: false})
            // if(isCloseToBottom(nativeEvent)){
            //   // alert('close to bottom')
            // }
          // }
        }
        
      >
        <AdsCarousel />
        <Categories />
        <Offers />
        <FlashSale />
        <Vouchers />
        {refreshing ? <></> :  <Suggestions data = {suggestionsArr}/>}
      </Animated.ScrollView>

    </View>
  );
};

// const mapStateToProps = (state) => ({
//   myCart: state.toktokMall.myCart
// })

// const mapDispatchToProps = (dispatch) => ({
//   createMyCartSession: (action, payload) => dispatch({type: 'CREATE_MY_CART_SESSION', action,  payload}),
// });

// export const ToktokMallLandingScreen = connect(mapStateToProps, mapDispatchToProps)(Component);

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