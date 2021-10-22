import React, {useState, useEffect, useContext} from 'react';
import {Platform, StyleSheet, View, Image, Text, FlatList, TouchableOpacity} from 'react-native';

// Components
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';

// Hooks
import {useUserLocation} from 'toktokfood/hooks';
import {useSelector} from 'react-redux';
import {moderateScale, getStatusbarHeight, getIphoneNotchSize, getDeviceHeight} from 'toktokfood/helper/scale';
import {empty_cart} from 'toktokfood/assets/images';

// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

const ToktokFoodEmptyCart = () => {

  const [headerHeight, setHeaderHeight] = useState(0);

  const getHeaderHeight = (event) => {
    let height = event.nativeEvent.layout.height;
    setHeaderHeight(height);
  };
  console.log(headerHeight)
  return (
    <View style={styles.container}>
      <View onLayout={(event) => getHeaderHeight(event)}>
        <HeaderImageBackground>
          <HeaderTitle backOnly />
          <HeaderSearchBox />
        </HeaderImageBackground>
      </View>
      <View style={[styles.emptyContainer, { height: getDeviceHeight - (headerHeight * 1.5) }]}>
        <Image style={styles.emptyImg} resizeMode="contain" source={empty_cart} />
        <Text style={styles.emptyText}>
          Your cart is empty.
        </Text>
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
    color: '#9E9E9E',
    fontSize: FONT_SIZE.L,
    textAlign: 'center',
    marginTop: moderateScale(20),
    paddingHorizontal: moderateScale(30)
  }
});
