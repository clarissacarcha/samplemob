import { rest } from 'lodash';
import React from 'react';
import {View, StyleSheet, TouchableHighlight, Platform} from 'react-native';
import {COLOR} from '../../../res/constants';

export const Card = ({onPress, children, containerStyle, ...rest}) => {
  return (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={styles.touchable} {...rest}>
      <View style={[styles.cardShadow, containerStyle]}>{children}</View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 4,
  },
  cardShadow: {
    backgroundColor: 'white',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
    overflow: Platform.OS === "ios" ? 'visible' : 'hidden',    
  },
});
