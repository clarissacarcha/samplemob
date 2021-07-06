import React from 'react';
import {Image, View, Text} from 'react-native';

import styles from '../styles';
import {food1} from 'toktokfood/assets/images';

const MyOrderList = () => {
  const RenderFoodItem = () => {
    return (
      <>
        <View style={styles.orderItemContainer}>
          <Image style={styles.foodItemImage} source={food1} />
          <View style={styles.orderInfoWrapper}>
            <Text style={styles.orderText}>Americano</Text>
            <Text style={styles.orderText}>x1</Text>
            <Text style={styles.orderText}>Size: Venti</Text>
            <Text style={styles.orderText}>Add on: Extra Cream</Text>
            <Text style={styles.orderText}>Note: Less sugar</Text>
          </View>
          <View style={styles.priceWrapper}>
            <Text style={styles.actionText}>Edit</Text>
            <Text style={styles.foodPrice}>PHP 48.00</Text>
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
          <Text style={styles.actionText}>Add Items</Text>
        </View>
        <View>
          <RenderFoodItem />
          <RenderFoodItem />
        </View>
      </View>
    </>
  );
};

export default MyOrderList;
