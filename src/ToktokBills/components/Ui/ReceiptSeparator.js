import React from 'react';
import {View, StyleSheet} from 'react-native';

export const ReceiptSeparator = () => {
  return (
    <>
      <View style={styles.roundLeft} />
      <View style={styles.roundRight} />
    </>
  );
};

const styles = StyleSheet.create({
  roundLeft: {
    overflow: 'hidden',
    width: 20,
    height: 30,
    position: 'absolute',
    left: -2,
    bottom: 80,
    marginLeft: -15,
    marginBottom: 8,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: '#F8F6CB',
    borderTopColor: '#ededed',
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderRightColor: '#ededed',
    borderBottomWidth: 2,
    borderBottomColor: '#ededed',
  },
  roundRight: {
    overflow: 'hidden',
    width: 20,
    height: 30,
    position: 'absolute',
    right: -2,
    bottom: 80,
    marginRight: -15,
    marginBottom: 8,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    backgroundColor: '#F8F6CB',
    borderTopColor: '#ededed',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderLeftColor: '#ededed',
    borderBottomWidth: 2,
    borderBottomColor: '#ededed',
  },
});
