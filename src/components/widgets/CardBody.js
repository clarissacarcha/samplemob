import React from 'react';
import {View, StyleSheet} from 'react-native';

export const CardBody = ({children}) => {
  return <View style={styles.cardBody}>{children}</View>;
};

const styles = StyleSheet.create({
  cardBody: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
