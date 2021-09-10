import React from 'react';
import {Image, View, Text} from 'react-native';

import styles from '../styles';
import {food1} from 'toktokfood/assets/images';
import {useRoute} from '@react-navigation/native';

import {MY_ORDERS} from 'toktokfood/helper/strings';

const MyOrderList = () => {
  const route = useRoute();
  const {amount, cartDetails} = route.params;

  const displayAddOns = (addons) => {
    return Object.entries(addons).map((item) => {
      return item.map((val) => {
        return <Text style={styles.orderText}>{`${item[0]}: ${val.addon_name}`}</Text>;
      });
    });
  };

  const onPressEdit = (item) => {};

  const renderFoodItem = (item) => {
    let {quantity, addons, notes, srp_totalamount, productImage, productName} = item;
    return (
      <>
        <View style={styles.orderItemContainer}>
          <Image style={styles.foodItemImage} source={{uri: productImage}} />
          <View style={styles.orderInfoWrapper}>
            <Text style={(styles.orderText, {fontWeight: '500'})}>{productName}</Text>
            <Text style={[styles.orderText]}>{`x${quantity}`}</Text>
            {displayAddOns(addons)}
            {!!notes && <Text style={styles.orderText}>{`Note: ${notes}`}</Text>}
          </View>
          <View style={styles.priceWrapper}>
            <Text onPress={() => onPressEdit(item)} style={styles.actionText}>
              Edit
            </Text>
            <Text style={styles.foodPrice}>PHP {srp_totalamount.toFixed(2)}</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={[styles.deliverWrapper]}>
          <Text style={styles.sectionTitle}>My Orders</Text>
          {/* Add Items */}
          <Text style={styles.actionText}></Text>
        </View>
        <View>
          {cartDetails.items.map((v) => {
            return renderFoodItem(v);
          })}
        </View>
      </View>
    </>
  );
};

export default MyOrderList;
