import React, {useEffect, useContext, useState, useCallback} from 'react';
import Toast from 'react-native-simple-toast';
import {useNavigation, useRoute} from '@react-navigation/native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import {VerifyContext} from './VerifyContextProvider';
import uuid from 'react-native-uuid';
import _ from 'lodash';

// Utils
import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';
import {scale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';
import { storeTemporaryCart, getTemporaryCart } from 'toktokfood/helper/TemporaryCart';

import {useDispatch, useSelector} from 'react-redux';

export const FoodCart = ({basePrice = 0.0, loading}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const routes = useRoute();
  const { Id, selectedAddons, selectedItemId, selectedPrice, selectedQty } = routes.params;
  const {
    totalPrice,
    setTotalPrice,
    optionsAmount,
    count,
    setCount,
    selected,
    notes,
    productDetails,
  } = useContext(VerifyContext);

  const computeTotalPrice = async (items) => {
    let amount = 0;
    await Object.values(items).map((val) => {
      amount += val.srp_totalamount;
    });
    return amount + totalPrice;
  };

  const isEqual = (...objects) => objects.every((obj) => JSON.stringify(obj) == JSON.stringify(objects[0]))

  // const isEqual = async(obj1, obj2) => {
  //   let res = false;
  //   // let objects = [...obj1, ...obj2]
  //   if(Object.keys(obj1).length > 0 && Object.keys(obj2).length > 0){
  //     for(let key in obj1){
  //       res = await obj1[key].every(val => {
  //         return obj2[key].some(b2 => b2.addon_id === val.addon_id);
  //       });
  //     }
  //   } else {

  //     res = Object.keys(obj1).length == 0 && Object.entries(obj2).length == 0
  //   }
  //   // console.log(objects)
  //   console.log(obj1, obj2, 'HAHA')
    
  //   console.log(res)
  //   return false
  // }

  const onRestaurantNavigate = useCallback( async () => {
    let { cart, totalAmount } = await getTemporaryCart();
    let hasCart = await cart.findIndex((val) => { return val.sys_shop == productDetails.sysShop });
    let totalItemPrice = hasCart >= 0 ? await computeTotalPrice(cart[hasCart].items) : totalPrice;
    let items = {};

    if (hasCart >= 0) {
      let item = {
        itemId: selectedItemId ? selectedItemId : uuid.v4(),
        sys_shop: parseInt(productDetails.sysShop),
        product_id: productDetails.Id,
        productImage: productDetails.filename,
        productName: productDetails.itemname,
        quantity: count.quantity,
        amount: totalPrice,
        srp_amount: totalPrice,
        srp_totalamount: totalPrice,
        total_amount: totalPrice,
        order_type: 1,
        notes: notes,
        addons: selected
      }
     
      let currentIndex = await cart[hasCart].items.findIndex((item) => { return isEqual(item.addons, selected) })
      let editedIndex = await cart[hasCart].items.findIndex((item) => { return item.itemId == selectedItemId })
    
      if(currentIndex < 0 && editedIndex >= 0){ // check if edited and not existing item in cart
        totalItemPrice = totalItemPrice - selectedPrice
        return pushProducts({ cart, hasCart, item, index: editedIndex, totalItemPrice, pushExistingItems: true })
      } 
      if(editedIndex >= 0){ await cart[hasCart].items.splice(editedIndex, 1) } // delete item from edited if already existed in cart
      if((currentIndex >= 0 && selectedQty != item.quantity && editedIndex < 0)){ // check quantity if same and come from edit
        let tempCart = cart[hasCart].items[currentIndex]
        item.quantity += tempCart.quantity;
        item.srp_totalamount += tempCart.srp_totalamount;
        item.srp_amount += tempCart.srp_amount;
        item.amount += tempCart.amount;
        item.total_amount += tempCart.total_amount;
      }
   
      if(editedIndex >= 0){ 
        totalItemPrice = totalItemPrice - selectedPrice
      }
      currentIndex >= 0 ? (
        pushProducts({ cart, hasCart, item, index: currentIndex, totalItemPrice, pushExistingItems: true })
      ) : (
        pushProducts({ cart, hasCart, item, totalItemPrice, pushExistingItems: false })
      )
    } else {
      if(cart.length > 0){
        Alert.alert(
          'You have existing items on your cart. If you add this to cart, the current cart will be empty. Would you like to proceed?',
          '',
        [
          { text: 'No', onPress: () => {} },
          { text: "Yes", onPress: () => onPressYes(totalItemPrice) },
        ]);
      } else {
        onPressYes(totalItemPrice)
      };
    }
  }, [totalPrice, setTotalPrice, optionsAmount, count, setCount, selected, notes, productDetails ]);

  const onPressYes = async(totalItemPrice) => {
    items = [{
      sys_shop: parseInt(productDetails.sysShop),
      branchid: 0,
      daystoship: 0,
      daystoship_to: 0,
      items: [
        {
          itemId: uuid.v4(),
          sys_shop: parseInt(productDetails.sysShop),
          product_id: productDetails.Id,
          productImage: productDetails.filename,
          productName: productDetails.itemname,
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
    }]
    processStoreTemporaryCart({ cart: items, totalAmount: {[productDetails.sysShop]: totalItemPrice}  })
  }

  const pushProducts = ({ cart, hasCart, item, index, totalItemPrice, pushExistingItems }) => {
    pushExistingItems ? cart[hasCart].items[index] = item : cart[hasCart].items.push(item);
    processStoreTemporaryCart({ cart, totalAmount: {[productDetails.sysShop]: totalItemPrice} })
  }

  const dispatchTotalAmount = (totalItemPrice) => {
    dispatch({type: 'SET_TOKTOKFOOD_CART_TOTAL', payload: {[productDetails.sysShop]: totalItemPrice}});
  }

  const processStoreTemporaryCart = async({ cart, totalAmount }) => {
    let res = await storeTemporaryCart({ cart, totalAmount })
    if(res.status == 200){
      Toast.show('Added to cart', Toast.SHORT);
      navigation.navigate('ToktokFoodRestaurantOverview');
    } else {
      Toast.show('Something went wrong', Toast.SHORT);
    }
  }

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
              disabled={productDetails.stocks == count.quantity}
              style={[styles.countButtons, {backgroundColor: COLOR.ORANGE}]}
              onPress={() => updateCartTotal()}>
              <MIcon name="add" color={COLOR.WHITE} size={20} />
            </TouchableOpacity>
          </View>
          <Text style={styles.total}>Subtotal: {totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          disabled={loading}
          style={[styles.cartButton, {backgroundColor: loading ? COLOR.LIGHT : COLOR.YELLOW}]}
          onPress={() => onRestaurantNavigate()}
        >
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
