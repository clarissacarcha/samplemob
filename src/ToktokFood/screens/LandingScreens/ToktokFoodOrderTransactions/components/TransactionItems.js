import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, Platform, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'toktokfood/helper/scale';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
// Fonts, Colors & Images
import {COLOR, FONT, FONT_SIZE} from 'res/variables';
import { time } from 'toktokfood/assets/images';

import { getOrderStatus, getSubMessageStatus, sameDay, dayTitle } from '../functions';

export const TransactionItems = (props) => {

  const navigation = useNavigation();

  const { item, index, data } = props
  let { address, orderStatus, shopDetails, orderDetails, dateOrdered } = item;
  let nextItem = data[index + 1] ? data[index + 1]  : false
  let isSameDay = false, lowerText = '', upperText = '';

  if(index === 0){
    upperText = dayTitle(dateOrdered)
  }
  if(nextItem){
    isSameDay = sameDay(dateOrdered.toString(), nextItem.dateOrdered.toString())
    lowerText = !isSameDay ? dayTitle(data[index + 1].dateOrdered) : ''
  }

  const onTransactionsNavigate = (id) => {
    if(orderStatus == 's' || orderStatus == 'c'){
      navigation.navigate('ToktokFoodOrderDetails', { appSalesOrderId: id, orderStatus })
    } else {
      navigation.navigate('ToktokFoodDriver', {  id })
    }
  };
  
  return (
    <>
    { !!upperText && <Text style={styles.dayTitle}>{upperText}</Text> }
    <TouchableWithoutFeedback key={item.orderId} onPress={() => onTransactionsNavigate(item.id)}>
      <View style={styles.itemContainer}>
        <View style={styles.imgWrapper}>
          <Image resizeMode="contain" source={shopDetails.logo} style={styles.imgShop} />
        </View>
        <View style={styles.restaurantInfo}>
          <View style={styles.infoWrapper}>
            <Text numberOfLines={1} style={styles.restaurantDetails}>
              {`${shopDetails.shopname} • ${shopDetails.address}`}
            </Text>
            <Text numberOfLines={1} style={styles.destinationDetails}>
              {orderDetails.length + ' items • ' + address}
            </Text>
            <View style={styles.activityWrapper}>
              <Image resizeMode="contain" source={time} style={styles.timeImg} />
              <Text numberOfLines={1} style={styles.statusMessage}>
                { getSubMessageStatus(item) }
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
    { !!lowerText && <Text style={styles.dayTitle}>{lowerText}</Text> }
    </>
  );
};

const styles = StyleSheet.create({
  restaurantInfo: {
    paddingEnd: 8,
    paddingStart: 10,
    color: COLOR.BLACK,
  },
  infoWrapper: {
    paddingEnd: 10,
    width: scale(250),
  },
  restaurantDetails: {
    color: COLOR.BLACK,
    fontFamily: FONT.BOLD,
  },
  destinationDetails: {
    marginVertical: 5,
    color: COLOR.DARK,
    fontFamily: FONT.REGULAR,
  },
  statusMessage: {
    color: COLOR.DARK,
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.S,
    paddingHorizontal: 5
  },
  dayTitle: {
    paddingHorizontal: 16,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD
  },
  timeImg: {
    width: scale(15),
    height: scale(15),
    tintColor: COLOR.DARK,
    resizeMode: 'contain'
  },
  imgShop: {
    height: 75,
    width: 78,
    borderRadius: Platform.OS === 'android' ? 3 : 12,
  },
  itemContainer: {
    width: scale(350),
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: verticalScale(8),
  },
  imgWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  activityWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    marginEnd: 4,
  },
});

