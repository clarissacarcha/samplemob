import React, {useState} from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';

// Components
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';

// Hooks
import {moderateScale, getDeviceHeight} from 'toktokfood/helper/scale';
import {empty_cart} from 'toktokfood/assets/images';

const ToktokFoodEmptyCart = () => {
  const [headerHeight, setHeaderHeight] = useState(0);

  const getHeaderHeight = event => {
    let height = event.nativeEvent.layout.height;
    setHeaderHeight(height);
  };

  return (
    <View style={styles.container}>
      <View onLayout={event => getHeaderHeight(event)}>
        <HeaderImageBackground>
          <HeaderTitle backOnly />
        </HeaderImageBackground>
      </View>
      <View style={[styles.emptyContainer, {height: getDeviceHeight - headerHeight * 1.5}]}>
        <Image style={styles.emptyImg} resizeMode="contain" source={empty_cart} />
        <Text style={styles.emptyTextTitle}>Empty Cart</Text>
        <Text style={styles.emptyText}>Browse our products and add to your cart now!</Text>
      </View>
    </View>
  );
};

export default ToktokFoodEmptyCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImg: {
    height: moderateScale(220),
    width: moderateScale(220),
  },
  emptyText: {
    // color: '#9E9E9E',
    fontSize: 13,
    textAlign: 'center',
    marginTop: moderateScale(10),
    // paddingHorizontal: moderateScale(30),
  },
  emptyTextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F6841F',
    marginTop: moderateScale(-30),
  },
});
