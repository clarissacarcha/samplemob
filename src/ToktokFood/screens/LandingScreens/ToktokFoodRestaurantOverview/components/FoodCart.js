/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useContext} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {useLazyQuery} from '@apollo/react-hooks';

// Utils
import {scale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';
import {useIsFocused} from '@react-navigation/native';

import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {VerifyContext} from '../components';
import {GET_ALL_TEMPORARY_CART, CHECK_HAS_TEMPORARY_CART} from 'toktokfood/graphql/toktokfood';

export const FoodCart = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id} = route.params.item;
  const {customerInfo} = useSelector((state) => state.toktokFood);
  const isFocus = useIsFocused();
  const {temporaryCart, setTemporaryCart, setFoodCartHeight} = useContext(VerifyContext);

  const [getAllTemporaryCart, {loading: cartLoading, error: cartError}] = useLazyQuery(GET_ALL_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getAllTemporaryCart}) => {
      let {items, totalAmount} = getAllTemporaryCart;
      setTemporaryCart({
        cartItemsLength: items.length,
        totalAmount,
        items: items,
      });
    },
  });

  const [checkHasTemporaryCart, {data: hasTemporaryCart, loading: hasCartLoading, error: hasCartError}] = useLazyQuery(
    CHECK_HAS_TEMPORARY_CART,
    {
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
      onError: () => Alert.alert('', 'Something went wrong.'),
    },
  );

  useEffect(() => {
    if (isFocus && customerInfo) {
      checkHasTemporaryCart({variables: {input: {userId: customerInfo.userId}}});
      getAllTemporaryCart({
        variables: {
          input: {
            userId: customerInfo.userId,
          },
        },
      });
    }
  }, [isFocus, customerInfo]);

  const getFoodCartHeight = (event) => {
    let height = event.nativeEvent.layout.height;
    setFoodCartHeight(height);
  };

  const onRestaurantNavigate = () => {
    navigation.navigate('ToktokFoodCart', {shopId: id, userId: customerInfo.userId});
  };

  if (temporaryCart.cartItemsLength == 0 || cartLoading || hasTemporaryCart?.checkHasTemporaryCart.shopid == 0) {
    return null;
  }
  return (
    <>
      <View onLayout={(event) => getFoodCartHeight(event)} style={[styles.container, styles.cartBorder]}>
        <View style={styles.foodItemTotalWrapper}>
          <Text style={styles.total}>{`${temporaryCart.cartItemsLength} ${
            temporaryCart.cartItemsLength > 1 ? 'items' : 'item'
          }`}</Text>
          <Text style={styles.total}>Total: {temporaryCart.totalAmount.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          disabled={temporaryCart.cartItemsLength == 0}
          style={[
            styles.cartButton,
            {backgroundColor: temporaryCart.cartItemsLength == 0 ? COLOR.LIGHT : COLOR.YELLOW},
          ]}
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
