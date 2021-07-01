import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import {OrderAddress, OrderFee, OrderList, OrderLogs, OrderNote, OrderRider, OrderTitle} from './components';

const ToktokFoodOrderDetails = () => {
  return (
    <View style={styles.container}>
      <HeaderImageBackground>
        <HeaderTitle title="Order Details" />
      </HeaderImageBackground>

      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <OrderTitle />
        <OrderAddress />
        <OrderNote title="Note" label="Tabi ng vape shop na may black na gate" />
        <OrderRider />
        <OrderList />
        <OrderFee />
        <OrderNote title="Payment Method" label="Cash-on Delivery" />
        <OrderLogs />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollView: {paddingBottom: 150},
});

export default ToktokFoodOrderDetails;
