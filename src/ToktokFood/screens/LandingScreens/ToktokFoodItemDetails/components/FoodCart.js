import React, {useEffect, useState} from 'react';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

// Utils
import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';
import {scale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';

import {useDispatch} from 'react-redux';

const FoodCart = ({item_price = 0.0, currentTotal = 0.0}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(0);

  const onRestaurantNavigate = () => {
    dispatch({type: 'SET_TOKTOKFOOD_CART_TOTAL', payload: {price: (total + currentTotal)}});

    Toast.show('Added to cart', Toast.SHORT);
    navigation.navigate('ToktokFoodRestaurantOverview');
  };

  const updateCartTotal = (type = 'ADD') => {
    if (type === 'ADD') {
      setCount(count + 1);
    } else {
      count > 1 && setCount(count - 1);
    }
  };

  const updateCartStates = () => {
    setTotal(count * item_price);
  };

  useEffect(() => {
    updateCartStates();
  }, [count, item_price]);

  return (
    <>
      <View style={[styles.container, styles.cartBorder]}>
        <View style={styles.foodItemTotalWrapper}>
          <View style={styles.countWrapper}>
            <TouchableOpacity
              disabled={count < 2}
              style={[styles.countButtons, {backgroundColor: count < 2 ? COLOR.LIGHT : COLOR.MEDIUM}]}
              onPress={() => updateCartTotal('REMOVE')}>
              <MIcon name="remove" color={COLOR.BLACK} size={25} />
            </TouchableOpacity>
            <Text style={styles.countText}>{count}</Text>
            <TouchableOpacity
              style={[styles.countButtons, {backgroundColor: COLOR.ORANGE}]}
              onPress={() => updateCartTotal()}>
              <MIcon name="add" color={COLOR.WHITE} size={20} />
            </TouchableOpacity>
          </View>
          <Text style={styles.total}>Subtotal: {total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.cartButton} onPress={() => onRestaurantNavigate()}>
          <Text style={styles.buttonText}>Add to Cart</Text>
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
    width: getDeviceWidth - 28,
    justifyContent: 'space-between',
  },
  total: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  countWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countButtons: {
    height: 32,
    width: 32,
    borderRadius: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    color: COLOR.BLACK,
    marginHorizontal: 9,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
});

export default React.memo(FoodCart);
