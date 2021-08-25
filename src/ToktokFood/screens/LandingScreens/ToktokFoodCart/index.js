import React from 'react';
import {View, KeyboardAvoidingView, ScrollView, Platform} from 'react-native';
import InputScrollView from 'react-native-input-scroll-view';

import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';

import styles from './styles';
import {ReceiverLocation, AlsoOrder, MyOrderList, OrderTotal, PaymentDetails, RiderNotes} from './components';

import {useSelector} from 'react-redux';

// Utils
import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(110 + getStatusbarHeight) : moderateScale(95),
  bgImage: Platform.OS === 'android' ? moderateScale(105 + getStatusbarHeight) : moderateScale(80),
};

const ToktokFoodCart = () => {

  const {price} = useSelector((state) => state.toktokFood.totalAmount);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null} style={styles.container}>
      <ScrollView bounces={false}>
        <View style={styles.container}>
          <HeaderImageBackground customSize={CUSTOM_HEADER}>
            <HeaderTitle showAddress={false} title="Order Details" />
          </HeaderImageBackground>
          <ReceiverLocation />
          <MyOrderList />
          <AlsoOrder />
          <OrderTotal subtotal={price} />
          <PaymentDetails />
          <RiderNotes />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ToktokFoodCart;
