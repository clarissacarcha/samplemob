import React from 'react';
import {Image, View, Text} from 'react-native';

import styles from '../styles';
import {food1} from 'toktokfood/assets/images';

import {MY_ORDERS} from 'toktokfood/helper/strings';

const MyOrderList = () => {

  const renderFoodItem = (item) => {
    return (
      <>
        <View style={styles.orderItemContainer}>
          <Image style={styles.foodItemImage} source={item.image} />
          <View style={styles.orderInfoWrapper}>
            <Text style={[styles.orderText, {fontWeight: '500'}]}>x1</Text>
            <Text style={styles.orderText}>Americano</Text>
            <Text style={styles.orderText}>Size: Venti</Text>
            <Text style={styles.orderText}>Add on: Extra Cream</Text>
            <Text style={styles.orderText}>Note: Less sugar</Text>
          </View>
          <View style={styles.priceWrapper}>
            {/* Edit */}
            <Text style={styles.actionText}></Text>
            <Text style={styles.foodPrice}>PHP {item.price.toFixed(2)}</Text>
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
          {MY_ORDERS.map((v) => {
            return renderFoodItem(v);
          })}
        </View>
      </View>
    </>
  );
};

export default MyOrderList;
