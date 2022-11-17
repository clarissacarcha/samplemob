import React, {useRef, useEffect, useCallback} from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import BackIcon from '../assets/icons/arrow-left-icon.png';
import {DARK, COLOR} from '../res/constants';
import EntypoIcon from 'react-native-vector-icons/Entypo';

export const HeaderBack = ({onBack}) => {
  const navigation = useNavigation();

  const onPress = throttle(
    () => {
      if (onBack) {
        onBack();
      } else {
        navigation.pop();
      }
    },
    1000,
    {trailing: false},
  );

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

  const onPressThrottled = useThrottle(onPress, 1000);

  return (
    <TouchableOpacity onPress={onPressThrottled} style={styles.box}>
      <Image source={BackIcon} resizeMode={'contain'} style={{width: 15, height: 15}} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  box: {
    height: 50,
    width: 100,
    // width: 50,
    justifyContent: 'center',
    paddingLeft: 17,
    // alignItems: 'center',
  },
});
