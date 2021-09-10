import React, {useEffect, useState, useContext} from 'react';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {VerifyContext} from './VerifyContextProvider';
import {useRoute} from '@react-navigation/native';

// Utils
import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';
import {scale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';

import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';

export const FoodCart = ({basePrice = 0.0, currentTotal = 0.0}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const routes = useRoute();
  const restaurantData = routes.params;
  const {totalPrice, setTotalPrice, optionsAmount, count, setCount, selected, notes} = useContext(VerifyContext);
  const {cart, totalAmount} = useSelector((state) => state.toktokFood);

  const arrangeAddOns = () => {
    let data = [];
    Object.values(selected).map((item) => {
      item.map((val) => {
        data.push(val);
      });
    });
    return data;
  };

  const computeTotalPrice = async (items) => {
    let amount = 0;
    await Object.values(items).map((val) => {
      amount += val.srp_totalamount;
    });
    return amount + totalPrice;
  };

  const isEqual = (...objects) => objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));

  const onRestaurantNavigate = async () => {
    let hasCart = await cart.findIndex((val) => {
      return val.sys_shop == restaurantData.shopId;
    });
    let items = {};
    let totalItemPrice = hasCart > -1 ? await computeTotalPrice(cart[hasCart].items) : totalPrice;

    if (hasCart > -1) {
      let item = {
        sys_shop: parseInt(restaurantData.shopId),
        product_id: restaurantData.Id,
        productImage: routes.params.filename,
        productName: routes.params.itemname,
        quantity: count.quantity,
        amount: totalPrice,
        srp_amount: totalPrice,
        srp_totalamount: totalPrice,
        total_amount: totalPrice,
        order_type: 1,
        notes: notes,
        addons: selected
      }
    
      let filterData = await cart[hasCart].items.filter((item) => { return item.product_id == restaurantData.Id })
      if(filterData.length > 0){
        filterData.map((val, index) => {
          if (isEqual(val.addons, item.addons)) {
            item.quantity += val.quantity;
            item.srp_totalamount += val.srp_totalamount;
            item.srp_amount += val.srp_amount;
            item.amount += val.amount;
            item.total_amount += val.total_amount;

            cart[hasCart].items[index] = item;
          } else {
            cart[hasCart].items.push(item);
          }
        });
      } else {
        cart[hasCart].items.push(item);
      }
    } else {
      items = {
        sys_shop: parseInt(restaurantData.shopId),
        branchid: 0,
        daystoship: 0,
        daystoship_to: 0,
        items: [
          {
            sys_shop: parseInt(restaurantData.shopId),
            product_id: restaurantData.Id,
            productImage: routes.params.filename,
            productName: routes.params.itemname,
            quantity: count.quantity,
            amount: totalPrice,
            srp_amount: totalPrice,
            srp_totalamount: totalPrice,
            total_amount: totalPrice,
            order_type: 1,
            notes: notes,
            addons: selected
          },
        ],
      };
      dispatch({type: 'SET_TOKTOKFOOD_CART_ITEMS', payload: [...cart, items]});
    }
    dispatch({type: 'SET_TOKTOKFOOD_CART_TOTAL', payload: {...totalAmount, [restaurantData.shopId]: totalItemPrice}});
    Toast.show('Added to cart', Toast.SHORT);
    navigation.navigate('ToktokFoodRestaurantOverview');
  };

  const updateCartTotal = (type = 'ADD') => {
    let quantity = 1;
    if (type === 'ADD') {
      quantity = count.quantity + 1;
    } else {
      quantity = count.quantity - 1;
    }
    setCount({type, quantity});
  };

  const updateCartStates = () => {
    if (count.type) {
      let amount = basePrice + optionsAmount;
      if (count.type == 'ADD') {
        setTotalPrice(totalPrice + amount);
      } else {
        setTotalPrice(totalPrice - amount);
      }
    }
  };

  useEffect(() => {
    updateCartStates();
  }, [count]);

  return (
    <>
      <View style={[styles.container, styles.cartBorder]}>
        <View style={styles.foodItemTotalWrapper}>
          <View style={styles.countWrapper}>
            <TouchableOpacity
              disabled={count.quantity < 2}
              style={[styles.countButtons, {backgroundColor: count.quantity < 2 ? COLOR.LIGHT : COLOR.MEDIUM}]}
              onPress={() => updateCartTotal('REMOVE')}>
              <MIcon name="remove" color={COLOR.BLACK} size={25} />
            </TouchableOpacity>
            <Text style={styles.countText}>{count.quantity}</Text>
            <TouchableOpacity
              style={[styles.countButtons, {backgroundColor: COLOR.ORANGE}]}
              onPress={() => updateCartTotal()}>
              <MIcon name="add" color={COLOR.WHITE} size={20} />
            </TouchableOpacity>
          </View>
          <Text style={styles.total}>Subtotal: {totalPrice.toFixed(2)}</Text>
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

// export default React.memo(FoodCart);
