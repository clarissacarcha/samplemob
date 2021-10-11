import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT, SIZE, COLOR} from 'res/variables';
import { time } from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';
import {orderStatusMessagePickUp, orderStatusMessageDelivery} from 'toktokfood/helper/orderStatusMessage';
import moment from 'moment';
import {useSelector} from 'react-redux';
import { getDistance, convertDistance } from 'geolib';

const OrderTitle = ({ transaction, riderDetails }) => {
  const {
    latitude,
    longitude,
    shopDetails,
    orderStatus,
    isconfirmed,
    address,
    dateReadyPickup,
    dateOrderProcessed,
    dateBookingConfirmed,
    orderIsfor,
    dateFulfilled
  } = transaction;
  const {location} = useSelector((state) => state.toktokFood);
  const status = orderIsfor == 1 ? orderStatusMessageDelivery(orderStatus, riderDetails, `${shopDetails?.shopname} (${shopDetails.address})`) 
    : orderStatusMessagePickUp(orderStatus, riderDetails, `${shopDetails?.shopname} (${shopDetails.address})`);
  
  const calculateDistance = (startTime, riderLocation) => {
    let distance = getDistance(
      {latitude: latitude, longitude: longitude},
      // {latitude: 14.537752, longitude: 121.001381},
      {latitude: riderLocation.latitude, longitude: riderLocation.longitude},
    );
    let distanceMiles = convertDistance(distance, 'mi');
    let duration = distanceMiles / 40;
    let additionalMins = 20 / 60;
    let final = (duration + additionalMins).toFixed(2);

    return moment(startTime).add(final, 'hours').format('hh:mm A');
  };

  const renderEstimatedPickUpTime = () => {
    let startTime = moment(dateOrderProcessed).format('LT')
    let endTime = moment(dateOrderProcessed).add(20, 'minutes').format('hh:mm A')
    return (
      <View style={styles.timeContainer}>
        <Image resizeMode="contain" source={time} style={styles.timeImg} />
        {/* <Text style={styles.time}>{`Estimated Pickup Time: ${startTime} - ${endTime}`}</Text> */}
        <Text style={styles.time}>{`Estimated Pickup Time: ${moment(dateOrderProcessed).format('ll')} - ASAP`}</Text>
      </View>
    )
  }

  const renderEstimatedDeliveryTime = () => {
    let date = dateReadyPickup.toString() != 'Invalid date' ? dateReadyPickup : dateBookingConfirmed;
    let startTime = moment(date).format('LT')
    let endTime = calculateDistance(date, riderDetails.location)
  
    return (
      <View style={styles.timeContainer}>
        <Image resizeMode="contain" source={time} style={styles.timeImg} />
        {/* <Text style={styles.time}>{`Estimated Delivery Time: ${startTime} - ${endTime}`}</Text> */}
        <Text style={styles.time}>{
          `Estimated Delivery Time: ${moment(date).format('ll')} - ${endTime}`
        }</Text>
      </View>
    )
  }

  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.orderDetailsText}>Order Details</Text>
      <Text style={styles.title}>{status.title}</Text>
      { !!status.message && <Text style={styles.status}>{status.message}</Text> }
      { transaction.orderIsfor == 2 && (orderStatus != 'p' && orderStatus!== 'c' && orderStatus !== 's')
        && renderEstimatedPickUpTime()}
      {(riderDetails != null && transaction.orderIsfor == 1 && (orderStatus != 'p' && orderStatus!== 'c' && orderStatus !== 's'))
        && renderEstimatedDeliveryTime() }
    </View>
  );
};

export default OrderTitle;

const styles = StyleSheet.create({
  detailsContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
  },
  status: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    marginTop: verticalScale(5),
  },
  time: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    marginLeft: moderateScale(5),
  },
  timeContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(5),
    alignItems: 'center'
  },
  title: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD
  },
  timeImg: {
    width: moderateScale(13),
    height: moderateScale(13),
    tintColor: COLOR.DARK,
    resizeMode: 'contain',
    tintColor: '#F6A100'
  },
  orderDetailsText: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
    marginBottom: moderateScale(20),
    marginTop: moderateScale(10)
  }
});
