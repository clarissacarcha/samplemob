import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {COLOR} from '../../../../res/constants';

export default () => (
  <View style={styles.container}>
    <ActivityIndicator size={24} color={COLOR} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
