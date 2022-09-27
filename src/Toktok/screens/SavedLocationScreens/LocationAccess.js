import React from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  Platform,
  Image,
  ImageBackground,
} from 'react-native';

import GradiantBG from '../../../assets/images/LinearGradiant.png';

export const LocationAccess = ({navigation, route}) => {
  return (
    <ImageBackground source={GradiantBG} style={{flex: 1}}>
      <Text>wasd</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({});
