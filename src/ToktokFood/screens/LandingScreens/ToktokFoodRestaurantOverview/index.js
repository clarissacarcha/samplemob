import React from 'react';
import {View, StyleSheet} from 'react-native';

import {useSelector} from 'react-redux';

import {StickyView} from './components';
import {FoodCart, VerifyContextProvider} from './components';

import {MY_ORDERS} from 'toktokfood/helper/strings';

const ToktokFoodRestaurantOverview = ({ route }) => {
  const {price} = useSelector((state) => state.toktokFood.totalAmount);
  const { cart } = useSelector((state) => state.toktokFood);
  let hasCart = cart.findIndex((val) => { return val.sys_shop == route.params.item.id })
  console.log(hasCart, route.params.item)
  return (
    <VerifyContextProvider>
      <View style={styles.container}>
        <StickyView />
        <FoodCart itemSize={hasCart > -1 ? cart[hasCart].items.length : 0} currentTotal={price} />
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
