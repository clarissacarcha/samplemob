import React from 'react';
import {View, Text, ImageBackground, Image} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome';
import AIcon from 'react-native-vector-icons/MaterialIcons';
import { COLOR, FONT } from '../../../../../res/variables';
import {LandingHeader} from '../../../../Components';

export const ToktokMallLandingScreen = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      
      <LandingHeader />

      <View style={{flex: 1}}>
        <Text>Content Here</Text>
      </View>

    </View>
  );
};