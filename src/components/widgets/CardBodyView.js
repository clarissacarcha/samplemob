import React from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';
import {COLOR} from '../../res/constants';

export const CardBodyView = ({onPress, children}) => {
  return <View style={styles.cardBody}>{children}</View>;
};

const styles = StyleSheet.create({
  cardBody: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
