import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import {OrderAddress, OrderFee, OrderList, OrderLogs, OrderNote, OrderRider, OrderTitle} from './components';

import {useSelector} from 'react-redux';

// Utils
import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(110 + getStatusbarHeight) : moderateScale(82),
  bgImage: Platform.OS === 'android' ? moderateScale(105 + getStatusbarHeight) : moderateScale(83),
};

const ToktokFoodOrderDetails = () => {
  const {price} = useSelector((state) => state.toktokFood.totalAmount);
  return (
    <View style={styles.container}>
      <HeaderImageBackground customSize={CUSTOM_HEADER}>
        <HeaderTitle title="Order Details" />
      </HeaderImageBackground>

      <ScrollView bounces={false} contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <OrderTitle />
        <OrderAddress />
        <OrderNote title="Note" label="Tabi ng vape shop na may black na gate" />
        <OrderRider />
        <OrderList />
        <OrderFee subtotal={price} />
        <OrderNote title="Payment Method" label="Cash-on Delivery" />
        <OrderLogs />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFF'},
  scrollView: {paddingBottom: 50},
});

export default ToktokFoodOrderDetails;
