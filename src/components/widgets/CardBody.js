import React from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';
import {COLOR} from '../../res/constants';

export const CardBody = ({onPress, children}) => {
  if (!onPress) {
    return <View style={styles.cardBody}>{children}</View>;
  }

  return (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={styles.touchable}>
      <View style={styles.cardBody}>{children}</View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  cardBody: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
