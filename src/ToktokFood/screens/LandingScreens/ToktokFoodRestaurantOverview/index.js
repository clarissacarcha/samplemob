import React from 'react';
import {View, StyleSheet} from 'react-native';

import {useSelector} from 'react-redux';

import {StickyView} from './components';
import {FoodCart, VerifyContextProvider} from './components';

const ToktokFoodRestaurantOverview = ({route}) => {
  const {price} = useSelector((state) => state.toktokFood.totalAmount);
  return (
    <VerifyContextProvider>
      <View style={styles.container}>
        <StickyView />
        <FoodCart/>
      </View>
    </VerifyContextProvider>
  );
};

export default ToktokFoodRestaurantOverview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
