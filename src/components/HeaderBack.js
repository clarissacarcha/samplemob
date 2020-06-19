import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableHighlight} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLOR, DARK} from '../res/constants';
import FIcon from 'react-native-vector-icons/Feather';

export const HeaderBack = ({label}) => {
  const navigation = useNavigation();

  const onSubmit = () => {
    navigation.pop();
  };

  return (
    <TouchableHighlight onPress={onSubmit} underlayColor={COLOR} style={styles.iconBox}>
      <FIcon name="chevron-left" size={24} color={COLOR} style={styles.icon} />
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  iconBox: {
    borderRadius: 10,
    marginLeft: 10,
  },
  icon: {
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 30,
    width: 30,
    backgroundColor: DARK,
    borderRadius: 10,
  },
});
