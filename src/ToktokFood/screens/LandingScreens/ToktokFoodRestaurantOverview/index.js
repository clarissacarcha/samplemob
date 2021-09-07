import React from 'react';
import {View, StyleSheet} from 'react-native';

import {useSelector} from 'react-redux';

import {StickyView} from './components';
import {FoodCart, VerifyContextProvider} from './components';

import {MY_ORDERS} from 'toktokfood/helper/strings';

const ToktokFoodRestaurantOverview = () => {
  const {price} = useSelector((state) => state.toktokFood.totalAmount);

  return (
    <VerifyContextProvider>
      <View style={styles.container}>
        <StickyView />
        <FoodCart itemSize={MY_ORDERS.length} currentTotal={price} />
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
