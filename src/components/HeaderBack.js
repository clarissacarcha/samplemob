import React from 'react';
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

  return (
    <TouchableOpacity onPress={onPress} style={styles.box}>
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
