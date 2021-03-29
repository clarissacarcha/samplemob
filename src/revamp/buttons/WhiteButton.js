import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {COLOR, DARK, COLOR_UNDERLAY} from '../../res/constants';

import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLine from 'react-native-vector-icons/SimpleLineIcons';

const ICON_SET = {
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

export const WhiteButton = ({
  label,
  onPress,
  style,
  prefixSet = null,
  prefixName,
  prefixSize = 24,
  suffixSet = null,
  suffixName,
  suffixSize = 24,
}) => {
  const PrefixIcon = () => {
    if (!prefixSet) {
      return null;
    }

    const Icon = ICON_SET[prefixSet];

    return <Icon name={prefixName} size={prefixSize} style={{paddingLeft: 10}} color={COLOR} />;
  };

  const SuffixIcon = () => {
    if (!suffixSet) {
      return null;
    }

    const Icon = ICON_SET[suffixSet];

    return <Icon name={suffixName} size={suffixSize} style={{paddingRight: 10}} color={DARK} />;
  };

  return (
    <TouchableHighlight onPress={onPress} style={styles.whiteButton} underlayColor={COLOR_UNDERLAY}>
      <View style={[styles.whiteButtonBox, style]}>
        <PrefixIcon />
        <Text style={styles.label}>{label}</Text>
        <SuffixIcon />
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  whiteButton: {
    borderRadius: 5,
  },
  whiteButtonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: COLOR,
    borderRadius: 5,
  },
  label: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
