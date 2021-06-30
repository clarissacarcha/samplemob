import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

// Utils
import {scale, getDeviceWidth} from 'toktokfood/helper/scale';

import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';

const FoodCart = () => {
  return (
    <>
      <View style={[styles.container, styles.cartBorder]}>
        <View style={styles.foodItemTotalWrapper}>
          <View>
            <TouchableOpacity></TouchableOpacity>
            <Text></Text>
            <TouchableOpacity></TouchableOpacity>
          </View>
          <Text style={styles.total}>Total: 48.00</Text>
        </View>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: scale(120),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.WHITE,
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
    width: getDeviceWidth - 28,
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  total: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
});

export default FoodCart;
