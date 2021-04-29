import React from 'react';
import {View, StyleSheet} from 'react-native';
import {COLORS, DARK} from '../../res/constants';

import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLine from 'react-native-vector-icons/SimpleLineIcons';

export const ICON_SET = {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Ionicon,
  Material,
  MaterialCommunity,
  SimpleLine,
};

export const VectorIcon = ({
  iconSet = Fontisto,
  name = 'motorcycle',
  size = 18,
  color = COLORS.YELLOW,
  style = {},
  onPress = null,
}) => {
  const Icon = iconSet;

  return <Icon name={name} size={size} color={color} style={style} onPress={onPress} />;
};
