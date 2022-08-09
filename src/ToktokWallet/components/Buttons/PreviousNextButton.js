import React, {useRef, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, TouchableOpacity} from 'react-native';
import {throttle} from 'lodash';
import CONSTANTS from 'common/res/constants';
const {FONT_FAMILY: FONT, FONT_SIZE, SIZE, COLOR} = CONSTANTS;
import {moderateScale} from 'toktokwallet/helper';

export const PreviousNextButton = ({
  label,
  labelTwo,
  onPressNext,
  onPressPrevious,
  style,
  delay = 2000,
  labelStyle,
  hasShadow = false,
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

  const onPressNextThrottled = useThrottle(onPressNext, delay);
  const onPressPreviousThrottled = useThrottle(onPressPrevious, delay);

  return (
    <>
      <View
        style={{
          ...(hasShadow && styles.shadow),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'center',
        }}
        underlayColor={'white'}>
        <TouchableOpacity style={[styles.previous, style, {width: '48%'}]} onPress={onPressPreviousThrottled}>
          <Text style={[styles.previousLabel, labelStyle]}>{label}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.blackButtonBox, style, {width: '48%'}]} onPress={onPressNextThrottled}>
          <Text style={[styles.label, labelStyle]}>{labelTwo}</Text>
        </TouchableOpacity>
      </View>
    </>
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
    backgroundColor: COLOR.ORANGE,
    borderRadius: 5,
  },
  previousLabel: {
    color: COLOR.ORANGE,
    fontSize: SIZE.L,
    paddingHorizontal: 10,
    fontFamily: FONT.SEMI_BOLD,
  },
  previous: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: COLOR.WHITE,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLOR.ORANGE,
  },
  label: {
    color: 'white',
    fontSize: SIZE.L,
    paddingHorizontal: 10,
    fontFamily: FONT.BOLD,
  },
  shadow: {
    paddingHorizontal: moderateScale(16),
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
