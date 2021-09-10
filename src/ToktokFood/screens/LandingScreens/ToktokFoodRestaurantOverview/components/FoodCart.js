import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

// Utils
import {scale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';
import {useIsFocused} from '@react-navigation/native';

import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';
import {useSelector} from 'react-redux';

export const FoodCart = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {cart, totalAmount} = useSelector((state) => state.toktokFood);
  const [hasCart, setHasCart] = useState(0);
  const [amount, setAmount] = useState(0);
  const isFocus = useIsFocused();

  const onRestaurantNavigate = () => {
    navigation.navigate('ToktokFoodCart', {amount});
  };

  useEffect(() => {
    let hasCart = cart.findIndex((val) => { return val.sys_shop == route.params.item.id })
    let data = hasCart > -1 ? cart[hasCart].items.length : 0
    let itemAmount = totalAmount[route.params.item.id] ? totalAmount[route.params.item.id] : 0
    setHasCart(data)
    setAmount(itemAmount)
  }, [isFocus])

  if (hasCart == 0) {
    return null;
  }
  return (
    <>
      <View style={[styles.container, styles.cartBorder]}>
        <View style={styles.foodItemTotalWrapper}>
          <Text style={styles.total}>{hasCart} item</Text>
          <Text style={styles.total}>Total: {amount.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          disabled={hasCart < 0}
          style={[styles.cartButton, {backgroundColor: hasCart < 0 ? COLOR.LIGHT : COLOR.YELLOW}]}
          onPress={() => onRestaurantNavigate()}>
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
    marginHorizontal: -2,
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
