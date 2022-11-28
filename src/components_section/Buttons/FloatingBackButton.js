import React from 'react';
import {Image, StyleSheet, StatusBar} from 'react-native';
import {ThrottledOpacity} from '../ThrottledOpacity';
import ArrowLeft from '../../assets/icons/arrow-left-icon.png';
import CONSTANTS from '../../common/res/constants';

export const FloatingBackButton = ({navigation, popTo}) => {
  const onPressBack = () => {
    navigation.pop(popTo ? popTo : 1);
  };
  return (
    <ThrottledOpacity style={styles.button} onPress={onPressBack}>
      <Image source={ArrowLeft} resizeMode={'contain'} style={styles.image} />
    </ThrottledOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    zIndex: 999,
    backgroundColor: CONSTANTS.COLOR.WHITE,
    position: 'absolute',
    top: StatusBar.currentHeight + 23,
    left: 16,
    padding: 6,
  },
  image: {height: 15, width: 10},
});
