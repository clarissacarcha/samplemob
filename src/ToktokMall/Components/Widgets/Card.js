import React from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';
import {COLOR} from '../../../res/constants';

export const Card = ({onPress, children}) => {
  return (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={styles.touchable}>
      <View style={styles.cardShadow}>{children}</View>
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
    overflow: 'hidden',    
  },
});
