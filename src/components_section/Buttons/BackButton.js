import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {ThrottledOpacity} from '../ThrottledOpacity';
import ArrowLeft from '../../assets/icons/arrow-left-icon.png';

export const BackButton = ({navigation, popTo}) => {
  const onPressBack = () => {
    navigation.pop(popTo ? popTo : 1);
  };
  return (
    <ThrottledOpacity style={styles.button} onPress={onPressBack}>
      <Image style={styles.image} source={ArrowLeft} resizeMode={'contain'} />
    </ThrottledOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 18,
  },
  image: {height: 15, width: 10},
});
