import React, {useRef, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {throttle} from 'lodash';
import {DARK, COLOR_UNDERLAY, FONT_REGULAR, MEDIUM} from '../../res/constants';
import {FONT, COLOR} from '../../res/variables';

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
  labelColor = DARK,
  description = null,
  onPress,
  delay = 2000,
  style,
  labelStyle = {},
  borderless = false,
  prefixSet = null,
  prefixName,
  prefixSize = 24,
  prefixColor = COLOR.YELLOW,
  suffixSet = null,
  suffixName,
  suffixSize = 24,
  suffixColor = DARK,
}) => {
  const useThrottle = (cb, delayDuration) => {
    const options = {leading: true, trailing: false}; // add custom lodash options
    const cbRef = useRef(cb);
    // use mutable ref to make useCallback/throttle not depend on `cb` dep
    useEffect(() => {
      cbRef.current = cb;
    });
    return useCallback(
      throttle((...args) => cbRef.current(...args), delayDuration, options),
      [delayDuration],
    );
  };

  const onPressThrottled = useThrottle(onPress, delay);

  const PrefixIcon = () => {
    if (!prefixSet) {
      return null;
    }

    const Icon = ICON_SET[prefixSet];

    return <Icon name={prefixName} size={prefixSize} style={borderless ? {} : {paddingLeft: 10}} color={prefixColor} />;
  };

  const SuffixIcon = () => {
    if (!suffixSet) {
      return null;
    }

    const Icon = ICON_SET[suffixSet];

    return <Icon name={suffixName} size={suffixSize} style={{paddingRight: 10}} color={suffixColor} />;
  };

  return (
    <TouchableHighlight onPress={onPressThrottled} style={styles.whiteButton} underlayColor={COLOR_UNDERLAY}>
      <View style={[styles.whiteButtonBox, style, borderless ? styles.borderless : {}]}>
        <PrefixIcon />
        <View style={{flex: 1}}>
          <Text style={[styles.label, {color: labelColor}, labelStyle]} numberOfLines={1}>
            {label}
          </Text>
          {description && (
            <Text style={styles.description} numberOfLines={1}>
              {description}
            </Text>
          )}
        </View>
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
    borderColor: COLOR.BLACK,
    borderRadius: 5,
  },
  borderless: {
    borderWidth: 0,
  },
  label: {
    paddingHorizontal: 10,
    fontSize: 13,
    fontFamily: FONT.BOLD,
    color: COLOR.DARK,
  },
  description: {
    paddingHorizontal: 10,
    fontSize: 11,
    color: MEDIUM,
    // fontFamily: FONT_REGULAR,
  },
});
