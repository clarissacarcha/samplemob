import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../../components';
import {BarIndicator} from 'react-native-indicators';
import {COLOR} from '../../res/constants';

export const Loader = props => {
  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <BarIndicator color={COLOR} count={5} />
      </View>
      <Text>Processing...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    height: 50,
  },
});
