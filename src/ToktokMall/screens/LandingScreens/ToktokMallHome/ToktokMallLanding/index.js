import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity, FlatList, SectionList, StyleSheet} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { COLOR, FONT } from '../../../../../res/variables';
import Animated from 'react-native-reanimated'
import {useValues, onScrollEvent} from 'react-native-redash'

//Main Components
import CustomIcon from '../../../../Components/Icons';
import {LandingHeader, AdsCarousel, StickyHomeHeader, LandingSubHeader} from '../../../../Components';

import {Categories, Offers, FlashSale, Vouchers, Suggestions} from './Components';

// header with animations
import LandingHeader2 from '../../../../Components/Header/LandingHeader2'
import LandingSubHeader2 from '../../../../Components/Header/LandingSubHeader2'


const Item = ({ title }) => (
  <View style={{}}>
    <Text style={{}}>{title}</Text>
  </View>
);

export const ToktokMallLandingScreen = () => {

  const [scrolling, setScrolling] = useState(false)
  const [y] = useValues([0], [])

  const HandleOnScroll = (r) => {
    let ypos = r.nativeEvent.contentOffset.y
    if(ypos > 100) setScrolling(true)
    else if (ypos <= 100) setScrolling(false)
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>     

      {/* <View style={{display: !scrolling ? "flex" : "none"}}>
        <LandingHeader />
      </View>

      <View style={{display: scrolling ? "flex" : "none"}}>
        <LandingSubHeader />
      </View> */}

      {/* <LandingHeader />

      <FlatList
        data={[1]}
        keyExtractor={(item, index) => item + index}
        showsVerticalScrollIndicator={false}
        onScroll={HandleOnScroll}
        renderItem={({ item }) => (
          <>
            {!scrolling && <AdsCarousel data={[1,2,3]} />}  
            <Categories data={[]} />
            <Offers data={[]} />
            <FlashSale data={[]} />
            <Vouchers data={[]} />
            <Suggestions key={1} data={[]} />
            <View style={{height: 10}}></View>
          </>
        )}        
      />      */}

      <Animated.ScrollView style = {StyleSheet.absoluteFill} 
        onScroll = {onScrollEvent({ y })}
        scrollEventThrottle = {1}
      >
        <View style = {{height: 150}} />
        <AdsCarousel />
        <Categories />
        <Offers />
        <FlashSale />
        <Vouchers />
        <Suggestions />
      </Animated.ScrollView>
      <LandingHeader2 {...{y}} />

      <LandingSubHeader2 {... { y}} />
      
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

    </View>
  );
};