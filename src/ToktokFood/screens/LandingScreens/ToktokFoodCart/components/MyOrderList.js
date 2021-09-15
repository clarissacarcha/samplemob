import React, {useEffect, useState, useRef, useContext} from 'react';
import {Image, View, Text, TouchableHighlight, TouchableOpacity, FlatList, Dimensions, Animated, Alert} from 'react-native';
import _ from 'lodash';
import styles from '../styles';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import { getTemporaryCart, removeTemporaryCartItem } from 'toktokfood/helper/TemporaryCart';
import { SwipeListView } from 'react-native-swipe-list-view';
import { delete_ic } from 'toktokfood/assets/images';
import { VerifyContext } from '../components';

const OrderList = () => {
  const route = useRoute();
  // const { cart } = route.params;
  const navigation = useNavigation();
  const {location, customerInfo, shopLocation} = useSelector((state) => state.toktokFood, _.isEqual);
  const {totalAmount, tempCart, setTempCart, setTotalAmount} = useContext(VerifyContext);
  const swipeListViewRef = useRef(null)

  const displayAddOns = (addons) => {
    return Object.entries(addons).map((item) => {
      if(item.length > 0){
        let addonName = [], optionName = item[0];
        item[1].map((val) => {
          addonName = addonName.concat(val.addon_name)
        })
        let lastString = optionName.substring(optionName.length - 1)
        optionName = lastString == 's' ? addonName.length > 1 ? optionName : optionName.slice(0, -1) : optionName
        return <Text style={styles.orderText}>{`${optionName}: ${addonName.join(', ')}`}</Text>;
      }
    });
  };

  const onPressEdit = async(Id, selectedAddons, selectedItemId, selectedPrice, selectedQty, selectedNotes) => {
    navigation.navigate('ToktokFoodItemDetails', { Id, selectedAddons, selectedItemId, selectedPrice, selectedQty, selectedNotes })
  };

  const renderFoodItem = ({ item }) => {
    const {quantity, addons, notes, srp_totalamount, productImage, productName, product_id, itemId} = item;
    return (
      <View style={styles.orderItemContainer}>
        <Image style={styles.foodItemImage} source={{uri: productImage}} />
        <View style={styles.orderInfoWrapper}>
          <Text style={(styles.orderText, {fontWeight: '500'})}>{productName}</Text>
          <Text style={[styles.orderText]}>{`x${quantity}`}</Text>
          {displayAddOns(addons)}
          {!!notes && <Text style={styles.orderText}>{`Notes: ${notes}`}</Text>}
        </View>
        <View style={styles.priceWrapper}>
          <Text
            onPress={() => onPressEdit(product_id, addons, itemId, srp_totalamount, quantity, notes)}
            style={styles.actionText}
          >
            Edit
          </Text>
          <Text style={styles.foodPrice}>PHP {srp_totalamount.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => deleteRow(data.item)}
        >
          <Image source={delete_ic} style={{ width: 20, height: 20 }} resizeMode='contain' />
        </TouchableOpacity>
      </View>
    )
  }

  const closeRow = () => {
    swipeListViewRef.current.closeAllOpenRows()
  };

  const deleteRow = async(rowKey) => {
    closeRow();
    const { sys_shop, srp_totalamount } = rowKey;
    const newData = [...tempCart[0].items];
    const prevIndex = tempCart[0].items.findIndex(item => item.key === rowKey);
      tempCart[0].items.splice(prevIndex, 1);
    const amount = totalAmount - srp_totalamount;
    const isLastItem = tempCart[0].items.length == 0;
    const res = await removeTemporaryCartItem({ cart: tempCart, totalAmount: { [sys_shop]: amount }}, isLastItem);
    if(isLastItem){ return navigation.goBack() }
    if(res.status == 200){
      setTempCart([...tempCart]);
      setTotalAmount(amount);
    }
  };

  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={[styles.myOrderWrapper]}>
          <Text style={styles.sectionTitle}>My Orders</Text>
          {/* Add Items */}
          <Text onPress={() => navigation.goBack()} style={styles.actionText}>Add Items</Text>
        </View>
        <View>
          <SwipeListView
            useFlatList
            disableRightSwipe
            data={tempCart[0]?.items}
            renderItem={renderFoodItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-80}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={1000}
            closeOnRowOpen={true}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => ( <View style={{ borderTopWidth: 1, borderTopColor: '#E6E6E6' }} /> )}
            ref={swipeListViewRef}
          />
        </View>
      </View>
    </>
  );
};

export default MyOrderList = React.memo(OrderList);