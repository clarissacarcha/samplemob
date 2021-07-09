import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {StickyView} from './components';

const ToktokFoodRestaurantOverview = () => {
  return (
    <View style={styles.container}>
      <StickyView />
    </View>
  );
};

export default ToktokFoodRestaurantOverview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
