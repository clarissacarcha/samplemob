import React, {useRef, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {throttle} from 'lodash';
import {COLORS, SIZES, FONTS} from 'src/res/constants';
import {moderateScale} from 'toktokwallet/helper';

export const OrangeButton = ({label, onPress, style, delay = 2000, labelStyle, hasShadow = false, buttonStyle}) => {
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

  return (
    <TouchableHighlight
      onPress={onPressThrottled}
      style={{...styles.blackButton, ...(hasShadow && styles.shadow), ...buttonStyle}}
      underlayColor={'white'}>
      <View style={[styles.blackButtonBox, style]}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  blackButton: {
    borderRadius: 5,
  },
  blackButtonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: COLORS.ORANGE,
    borderRadius: 5,
  },
  label: {
    color: 'white',
    fontSize: SIZES.L,
    paddingHorizontal: 10,
    fontFamily: FONTS.BOLD,
  },
  shadow: {
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'white',
    borderTopColor: '#F8F8F8',
    borderTopWidth: 2,
  },
});
