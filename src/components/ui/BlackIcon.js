import React from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';
import {COLOR, DARK} from '../../res/constants';

import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLine from 'react-native-vector-icons/SimpleLineIcons';

const iconSet = {
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

export const BlackIcon = ({set, name, size = 16, containerStyle = {}}) => {
  const Icon = iconSet[set];

  return (
    <View style={[styles.iconBox, containerStyle]}>
      <Icon name={name} size={size} color={COLOR} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconBox: {
    backgroundColor: DARK,
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});
