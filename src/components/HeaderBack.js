import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';

import {DARK} from '../res/constants';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

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
    <View style={styles.box}>
      <TouchableOpacity onPress={onPress}>
        <MaterialIcon name="chevron-left" size={30} color={DARK} />
      </TouchableOpacity>
    </View>
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
