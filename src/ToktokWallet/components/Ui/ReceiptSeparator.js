import React from 'react';
import {View, StyleSheet} from 'react-native';

export const ReceiptSeparator = ({bottomHeight = 80, left = -20, right = -20, roundLeftStyle, roundRightStyle}) => {
  return (
    <>
      <View style={[styles.roundLeft, {bottom: bottomHeight, left}, roundLeftStyle]} />
      <View style={[styles.roundRight, {bottom: bottomHeight, right}, roundRightStyle]} />
    </>
  );
};

const styles = StyleSheet.create({
  roundLeft: {
    overflow: 'hidden',
    width: 20,
    height: 30,
    position: 'absolute',
    bottom: 75,
    marginBottom: 8,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    backgroundColor: '#faf7d8',
  },
  roundRight: {
    overflow: 'hidden',
    width: 20,
    height: 30,
    position: 'absolute',
    bottom: 75,
    marginBottom: 8,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    backgroundColor: '#faf7d8',
  },
});
