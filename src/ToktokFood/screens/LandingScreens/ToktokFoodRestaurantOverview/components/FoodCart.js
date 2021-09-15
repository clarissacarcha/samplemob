import React, {useEffect, useState, useContext} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

// Utils
import {scale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';
import {useIsFocused} from '@react-navigation/native';

import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';
import {useSelector} from 'react-redux';
// import { getTemporaryCart } from 'toktokfood/helper/TemporaryCart';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {GET_TEMPORARY_CART} from 'toktokfood/graphql/toktokfood';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import {VerifyContext} from '../components';
export const FoodCart = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params.item;
  const {customerInfo} = useSelector((state) => state.toktokFood);
  const isFocus = useIsFocused();
  const {temporaryCart, setTemporaryCart, setFoodCartHeight} = useContext(VerifyContext);

  const getFoodCartHeight = (event) => {
    let height = event.nativeEvent.layout.height;
    setFoodCartHeight(height);
  };

  const [getTemporaryCart, {data, loading, error}] = useLazyQuery(GET_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({ getTemporaryCart }) => {
      if(getTemporaryCart.items.length > 0){
        let { items, totalAmount } = getTemporaryCart
        setTemporaryCart({
          cartItemsLength: items.length,
          totalAmount,
          items: items
        })
      }
    },
  });

  const onRestaurantNavigate = () => {
    navigation.navigate('ToktokFoodCart', { shopId: id, userId: customerInfo.userId });
  };
 
  useEffect(() => {
    if(isFocus){
      getTemporaryCart({
        variables: {
          input: {
            shopId: +id,
            userId: customerInfo.userId
          },
        },
      })
    }
  }, [isFocus])

  if(loading || error || temporaryCart.cartItemsLength == 0){
    return null
  }
  return (
    <>
      <View
        onLayout={(event) => getFoodCartHeight(event)}
        style={[styles.container, styles.cartBorder]}
      >
        <View style={styles.foodItemTotalWrapper}>
          <Text style={styles.total}>{temporaryCart.cartItemsLength} item</Text>
          <Text style={styles.total}>Total: {temporaryCart.totalAmount.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          disabled={temporaryCart.cartItemsLength == 0}
          style={[styles.cartButton, {backgroundColor: temporaryCart.cartItemsLength == 0 ? COLOR.LIGHT : COLOR.YELLOW}]}
          onPress={() => onRestaurantNavigate()}
        >
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
