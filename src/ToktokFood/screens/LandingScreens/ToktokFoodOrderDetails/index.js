import React from 'react';
import {StyleSheet, View} from 'react-native';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import {OrderAddress, OrderTitle} from './components';

const ToktokFoodOrderDetails = () => {
  return (
    <View style={styles.container}>
      <HeaderImageBackground>
        <HeaderTitle title="Order Details" />
      </HeaderImageBackground>

      <OrderTitle />
      <OrderAddress />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
});

export default ToktokFoodOrderDetails;
