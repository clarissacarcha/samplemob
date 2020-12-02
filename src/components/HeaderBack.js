import React from 'react';
import {StyleSheet, View, TouchableHighlight} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';

import {COLOR, DARK} from '../res/constants';
import FIcon from 'react-native-vector-icons/Feather';

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
    <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={styles.button}>
      <View style={styles.iconBox}>
        <FIcon name="chevron-left" size={24} color={COLOR} />
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    marginLeft: 10,
    overflow: 'hidden',

    height: 30,
    width: 30,
  },
  iconBox: {
    backgroundColor: DARK,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
