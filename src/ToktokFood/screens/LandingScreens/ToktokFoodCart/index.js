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
  container: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
};

const ToktokFoodCart = () => {

  const {price} = useSelector((state) => state.toktokFood.totalAmount);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null} style={styles.container}>
      <HeaderImageBackground customSize={CUSTOM_HEADER}>
        <HeaderTitle showAddress={false} title="Order Details" />
      </HeaderImageBackground>
      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70)}} >
        {/* <View style={styles.container}> */}
          <ReceiverLocation />
          <MyOrderList />
          <AlsoOrder />
          <OrderTotal subtotal={price} />
          <PaymentDetails />
          <RiderNotes />
        {/* </View> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ToktokFoodCart;
