import React, {useRef, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {throttle} from 'lodash';
import {COLORS, SIZES, FONTS} from 'src/res/constants';

export const YellowButton = ({label, onPress, style, delay = 2000, labelStyle}) => {
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
    <TouchableHighlight onPress={onPressThrottled} style={styles.blackButton} underlayColor={'white'}>
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
    backgroundColor: COLORS.YELLOW,
    borderRadius: 5,
  },
  label: {
    color: 'black',
    fontSize: SIZES.L,
    paddingHorizontal: 10,
    fontFamily: FONTS.BOLD,
  },
});
