import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// Fonts/Colors
import {COLORS} from 'res/constants';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';
import {orderStatusMessagePickUp, orderStatusMessageDelivery} from 'toktokfood/helper/orderStatusMessage';
import moment from 'moment';
import {useSelector} from 'react-redux';
import { getDistance, convertDistance } from 'geolib';

const OrderTitle = ({ transaction, riderDetails }) => {
  const { shopDetails, orderStatus, isconfirmed, address, dateReadyPickup, dateOrderProcessed, dateBookingConfirmed, orderIsfor } = transaction;
  const {location} = useSelector((state) => state.toktokFood);
  const date = riderDetails != null && orderStatus == 'po' ? dateOrderProcessed : dateReadyPickup
  const status = orderIsfor == 1 ? orderStatusMessageDelivery(orderStatus, riderDetails, `${shopDetails.shopname} (${shopDetails.address})`) 
    : orderStatusMessagePickUp(orderStatus, riderDetails, `${shopDetails.shopname} (${shopDetails.address})`);
  
  const calculateDistance = (startTime, riderLocation) => { 
   
    let distance = getDistance(
      { latitude: location?.latitude, longitude: location?.longitude },
      // { latitude: 14.537752, longitude: 121.001381 }
      { latitude: riderLocation.latitude, longitude: riderLocation.longitude },
    );
    let distanceMiles = convertDistance(distance, 'mi')
    let duration = distanceMiles / 60
    let hours = 20 / 60
    let final = (duration + hours).toFixed(2)
 
    return moment(startTime).add(final, 'hours').format('hh:mm A')
  }

  const renderEstimatedPickUpTime = () => {
    let startTime = moment(dateOrderProcessed).format('LT')
    let endTime = moment(dateOrderProcessed).add(20, 'minutes').format('hh:mm A')
    return (
      <View style={styles.timeContainer}>
        <MaterialIcon name="schedule" size={16} color={COLORS.YELLOWTEXT} />
        <Text style={styles.time}>{`Estimated Pickup Time: ${startTime} - ${endTime}`}</Text>
      </View>
    )
  }

  const renderEstimatedDeliveryTime = () => {
    let startTime = moment(dateBookingConfirmed).format('LT')
    let endTime = calculateDistance(dateBookingConfirmed, riderDetails.location)
    return (
      <View style={styles.timeContainer}>
        <MaterialIcon name="schedule" size={16} color={COLORS.YELLOWTEXT} />
        <Text style={styles.time}>{`Estimated Delivery Time: ${startTime} - ${endTime}`}</Text>
      </View>
    )
  }

  return (
    <View style={styles.detailsContainer}>
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
    // Box Shadow
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowRadius: 2,
    // shadowOffset: {
    //   width: 0,
    //   height: -3,
    // },
    // shadowColor: '#000',
    // elevation: 4,
    // shadowOpacity: 0.1,
  },
  status: {
    fontWeight: '300',
    marginTop: verticalScale(5),
  },
  time: {
    fontWeight: '400',
    marginLeft: moderateScale(5),
  },
  timeContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(5),
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
  },
});
