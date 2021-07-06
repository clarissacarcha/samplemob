import React from 'react';
import {useRoute} from '@react-navigation/native';
import {View, ScrollView} from 'react-native';

import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';

import styles from './styles';
import {ReceiverLocation, AlsoOrder, MyOrderList, OrderTotal, PaymentDetails, RiderNotes} from './components';

const ToktokFoodCart = () => {
  const routes = useRoute();
  return (
    <View style={styles.container}>
      <HeaderImageBackground>
        <HeaderTitle title="Order Details" />
      </HeaderImageBackground>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ReceiverLocation />
        <MyOrderList />
        <AlsoOrder />
        <OrderTotal />
        <PaymentDetails />
        <RiderNotes />
      </ScrollView>
    </View>
  );
};

export default ToktokFoodCart;
