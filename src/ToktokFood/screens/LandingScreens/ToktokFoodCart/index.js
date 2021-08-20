import React from 'react';
import {View} from 'react-native';
import InputScrollView from 'react-native-input-scroll-view';

import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';

import styles from './styles';
import {ReceiverLocation, AlsoOrder, MyOrderList, OrderTotal, PaymentDetails, RiderNotes} from './components';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(150 + getStatusbarHeight) : moderateScale(115),
  bgImage: Platform.OS === 'android' ? moderateScale(115 + getStatusbarHeight) : moderateScale(100),
};

const ToktokFoodCart = () => {
  return (
    <View style={styles.container}>
      <HeaderImageBackground customSize={CUSTOM_HEADER}>
        <HeaderTitle title="Order Details" />
      </HeaderImageBackground>
      <InputScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ReceiverLocation />
        <MyOrderList />
        <AlsoOrder />
        <OrderTotal />
        <PaymentDetails />
        <RiderNotes />
      </InputScrollView>
    </View>
  );
};

export default ToktokFoodCart;
