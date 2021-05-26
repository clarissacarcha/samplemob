import React, {useRef, useEffect, useCallback} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';

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
      <EntypoIcon name="chevron-thin-left" size={20} color={COLOR} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  box: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
