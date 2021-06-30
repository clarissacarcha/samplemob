import React from 'react';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

// Utils
import {scale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';

import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';

const FoodCart = () => {
  const navigation = useNavigation();

  const onRestaurantNavigate = () => {
    Toast.show('Added to cart', Toast.SHORT);
    navigation.navigate('ToktokFoodOrderDetails');
  };

  return (
    <>
      <View style={[styles.container, styles.cartBorder]}>
        <View style={styles.foodItemTotalWrapper}>
          <View style={styles.countWrapper}>
            <TouchableOpacity style={[styles.countButtons, {backgroundColor: COLOR.LIGHT}]}>
              <MIcon name="remove" color={COLOR.BLACK} size={25} />
            </TouchableOpacity>
            <Text style={styles.countText}>01</Text>
            <TouchableOpacity style={[styles.countButtons, {backgroundColor: COLOR.ORANGE}]}>
              <MIcon name="add" color={COLOR.WHITE} size={20} />
            </TouchableOpacity>
          </View>
          <Text style={styles.total}>Total: 48.00</Text>
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
    height: 38,
    width: 38,
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

export default FoodCart;
