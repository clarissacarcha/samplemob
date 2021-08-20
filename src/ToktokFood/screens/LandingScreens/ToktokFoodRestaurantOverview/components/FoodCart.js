import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

// Utils
import {scale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';

import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';

const FoodCart = () => {
  const navigation = useNavigation();

  const onRestaurantNavigate = () => {
    navigation.navigate('ToktokFoodCart');
  };

  return (
    <>
      <View style={[styles.container, styles.cartBorder]}>
        <View style={styles.foodItemTotalWrapper}>
          <Text style={styles.total}>0 item</Text>
          <Text style={styles.total}>Total: 0</Text>
        </View>
        <TouchableOpacity style={styles.cartButton} onPress={() => onRestaurantNavigate()}>
          <Text style={styles.buttonText}>View Cart</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: scale(130),
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    paddingVertical: verticalScale(7),
  },
  cartBorder: {
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopEndRadius: 18,
    borderTopStartRadius: 18,
    borderColor: COLOR.ORANGE,
  },
  cartButton: {
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZE.BUTTON_HEIGHT,
    backgroundColor: COLOR.YELLOW,
    width: getDeviceWidth - 28,
  },
  buttonText: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  foodItemTotalWrapper: {
    display: 'flex',
    marginBottom: 6,
    height: scale(50),
    flexDirection: 'row',
    alignItems: 'center',
    width: getDeviceWidth - 50,
    justifyContent: 'space-between',
  },
  total: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
});

export default React.memo(FoodCart);
