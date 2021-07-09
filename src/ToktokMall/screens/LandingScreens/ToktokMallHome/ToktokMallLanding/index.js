import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity, FlatList, SectionList} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { COLOR, FONT } from '../../../../../res/variables';

//Main Components
import CustomIcon from '../../../../Components/Icons';
import {LandingHeader, AdsCarousel} from '../../../../Components';

//Subcomponents
import {Categories, Offers, FlashSale, Vouchers, Suggestions} from './Components';

const Item = ({ title }) => (
  <View style={{}}>
    <Text style={{}}>{title}</Text>
  </View>
);

export const ToktokMallLandingScreen = () => {

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      
      <LandingHeader />

      {/* <ScrollView 
        vertical={true} 
        showsVerticalScrollIndicator={false} 
        style={{flex: 1}}
      >
        <AdsCarousel data={[1,2,3]} />  
        <Categories data={[]} />
        <Offers data={[]} />
        <FlashSale data={[]} />
        <Vouchers data={[]} />
        <Suggestions data={[]} />
        <View style={{height: 10}}></View>
      </ScrollView> */}

      <FlatList
        data={[1]}
        keyExtractor={(item, index) => item + index}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => {
          console.log("scrolling...")
        }}
        renderItem={({ item }) => (
          <>
          <AdsCarousel data={[1,2,3]} />  
          <Categories data={[]} />
          <Offers data={[]} />
          <FlashSale data={[]} />
          <Vouchers data={[]} />
          <Suggestions data={[]} />
          <View style={{height: 10}}></View>
          </>
        )}        
      /> 
     
    </View>
  );
};