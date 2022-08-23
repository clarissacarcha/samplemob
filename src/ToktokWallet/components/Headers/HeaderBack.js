import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import {COLOR, FONT} from 'src/res/variables';
import {moderateScale} from 'toktokwallet/helper';

export const HeaderBack = ({onBack, color = '#F6841F', label, styleContainer = {}}) => {
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
    <TouchableOpacity onPress={onPress} style={[styles.backContainer, styleContainer]}>
      <FIcon5 name="chevron-left" color={color} size={moderateScale(16)} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backContainer: {
    paddingLeft: moderateScale(15),
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  label: {
    fontFamily: FONT.BOLD,
    fontSize: moderateScale(14),
    marginLeft: moderateScale(5),
  },
});
