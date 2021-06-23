import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { COLOR, FONT } from '../../../../../res/variables';

//Main Components
import CustomIcon from '../../../../Components/Icons';
import {LandingHeader, AdsCarousel} from '../../../../Components';

//Subcomponents
import {Categories, Offers, FlashSale, Vouchers, Suggestions} from './Components';


export const ToktokMallLandingScreen = () => {

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      
      <LandingHeader />

      <ScrollView vertical={true} showsVerticalScrollIndicator={false} style={{flex: 1}}>

        <AdsCarousel data={[1,2,3]} />
  
        <Categories data={[]} />

        <Offers data={[]} />

        <FlashSale data={[]} />

        <Vouchers data={[]} />

        <Suggestions data={[]} />

        <View style={{height: 10}}></View>

      </ScrollView>

    </View>
  );
};