import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ImageBackground, Image} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome';
import AIcon from 'react-native-vector-icons/MaterialIcons';
import { COLOR, FONT } from '../../../../../res/variables';
import {LandingHeader, AdsCarousel} from '../../../../Components';
import Carousel from 'react-native-snap-carousel';
import { ScrollView } from 'react-native-gesture-handler';

export const ToktokMallLandingScreen = () => {

  const adsRef = useRef();

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      
      <LandingHeader />

      <ScrollView vertical={true} showsVerticalScrollIndicator={false} style={{flex: 1, paddingHorizontal: 15, paddingVertical: 15}}>

        <AdsCarousel data={[1,2,3]} />

      </ScrollView>

    </View>
  );
};