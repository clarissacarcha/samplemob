import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity, FlatList, SectionList, StyleSheet, Dimensions} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

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


const SCREEN_WIDTH = Dimensions.get('window').width;
const Item = ({ title }) => (
  <View style={{}}>
    <Text style={{}}>{title}</Text>
  </View>
);

export const ToktokMallLandingScreen = () => {

  const [scrolling, setScrolling] = useState(false)
  const [y] = useValues([0], [])
  const navigation = useNavigation();

  // const HandleOnScroll = (r) => {
  //   let ypos = r.nativeEvent.contentOffset.y
  //   if(ypos > 100) setScrolling(true)
  //   else if (ypos <= 100) setScrolling(false)
  // }

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

  const animateHeaderOpacity2 = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  })

  const animateHeaderOpacity3 = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - 120],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  })

  const top = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [0, -20],
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
    outputRange: [SCREEN_WIDTH * .92, SCREEN_WIDTH * .87],
    extrapolate: 'clamp'
    // extrapolateLeft: Extrapolate.CLAMP
    // extrapolateRight: Extrapolate.CLAMP
  })
  const translateLeft = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [SCREEN_WIDTH * .04,  SCREEN_WIDTH * .075],
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

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* <SectionList         
        renderSectionHeader={({section: {title}}) => (<View />)}
        sections={[
          {title: 'Ads', data: [1], renderItem: () => <AdsCarousel />},
          {title: 'Categories', data: [1], renderItem: () => <Categories />},
          {title: 'Offers', data: [1], renderItem: () => <Offers />},
          {title: 'FlashSale', data: [1], renderItem: () => <FlashSale />},
          {title: 'Vouchers', data: [1], renderItem: () => <Vouchers />},
          {title: 'Suggestions', data: [1], renderItem: () => <Suggestions />},
        ]}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item + index}
      /> */}
      {/* SUB HEADER  */}
       {/* <Animated.View style = {[ {opacity: animateHeaderOpacity2, zIndex: animateHeaderOpacity2}]} >
        <ImageBackground 
          source={banner}
          imageStyle={{ resizeMode: "stretch", width: '100%'}}
          style={{width: "100%", height: 100, position:'absolute', top: 0}}
        >
        <View style={[{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 35}]}>
          <TouchableOpacity onPress = {onBack}  style={{flex: 0, alignItems: 'center', paddingHorizontal: 15, paddingTop: 8}}>
            <FIcon5 name="chevron-left" color={COLOR.ORANGE} size={15}/>
          </TouchableOpacity>
          <View style={{flex: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 0, paddingTop: 8}}>
            <TouchableOpacity activeOpacity={1}  onPress = {onPress}  style={{flex: 0, backgroundColor: '#fff', width: '100%', padding: 4, elevation: 0, flexDirection: 'row', borderRadius: 6}}>
              <View style={{flex: 0, paddingHorizontal: 8, paddingVertical: 4}}>
                <AIcon name="search" color={COLOR.ORANGE} size={22}/>
              </View>
              <View style={{flex: 1, padding: 4}}>
                <Text style={{color: "darkgray"}}>Search</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingTop: 8}}>

          </View>
        </View>        
      </ImageBackground>
      </Animated.View> */}
      {/* MAIN HEADER */}
       {/* <Animated.View style = {[ {opacity: animateHeaderOpacity, zIndex: animateHeaderOpacity}]} >
         <ImageBackground 
          source={banner}
          imageStyle={{ resizeMode: "stretch", width: '100%'}}
          style={{width: "100%", height: 120}}
        >
        <View style={{flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
          <View style={{flex: 0, alignItems: 'center', paddingHorizontal: 15, paddingTop: 8}}>
            <FIcon5 name="chevron-left" color={COLOR.ORANGE} size={15}/>
          </View>
          <View style={{flex: 2}}></View>
          <View style={{flex: 8, alignItems: 'center', paddingTop: 15}}>
            <Animated.Image source={toktokmallH} style={[{width: '100%', height: 35, resizeMode: 'stretch'},{opacity:animateHeaderOpacity}]} />
          </View>
          <View style={{flex: 2}}></View>
          <View style={{flex: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15, paddingTop: 8}}>
            <View style={{flexDirection: 'row', paddingRight: 8}}>

            </View>
          </View>
        </View>
        <Animated.View style = {[{top:  translatey}]}>
        <TouchableOpacity onPress = {onPress} activeOpacity={1}  style={{flex: 1, backgroundColor: '#fff', width: '92%', marginLeft: '4%', position: 'absolute', bottom: -15, padding: 4, elevation: 8, flexDirection: 'row', borderRadius: 6, }}>
          <View style={{flex: 0, paddingHorizontal: 8,  paddingVertical: 4}}>
            <AIcon name="search" color={COLOR.ORANGE} size={22}/>
          </View>
          <View style={{flex: 0, justifyContent: 'center', paddingVertical: 4}}>
            <Text style={{color: "darkgray", fontSize: 13}}>Search</Text>
          </View>
        </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
      <View style={{height: 25}}></View>      
      </Animated.View> */}
      {/* <LandingHeader {...Header_Max_Height}/> */}
      
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
                  opacity:animateHeaderOpacity
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
        scrollEventThrottle = {16}
        onScroll = {
          Animated.event(
            [{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}],
            {useNativeDriver: false}
          )
        }
      >
        <AdsCarousel />
        <Categories />
        <Offers />
        <FlashSale />
        <Vouchers />
        <Suggestions />
      </Animated.ScrollView>

    </View>
  );
};

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