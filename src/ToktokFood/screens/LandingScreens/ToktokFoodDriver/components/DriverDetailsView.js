import React from 'react';
import {Platform, ScrollView, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {getDistance, convertDistance} from 'geolib';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT, SIZE, COLOR} from 'res/variables';

// Utils
import {moderateScale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';
import {orderStatusMessageDelivery} from 'toktokfood/helper/orderStatusMessage';
import moment from 'moment';

const DriverDetailsView = ({transaction, riderDetails, referenceNum, onCancel}) => {
  const navigation = useNavigation();
  const {location} = useSelector((state) => state.toktokFood);
  const {shopDetails, orderStatus, isconfirmed, address, dateReadyPickup, dateBookingConfirmed, dateOrderProcessed, isdeclined} = transaction;
  const status = orderStatusMessageDelivery(
    orderStatus,
    riderDetails,
    `${shopDetails.shopname} (${shopDetails.address})`,
    isdeclined
  );
  const date = dateReadyPickup.toString() != 'Invalid date' ? dateReadyPickup : dateBookingConfirmed

  const calculateDistance = (startTime, riderLocation) => {
    let distance = getDistance(
      {latitude: location?.latitude, longitude: location?.longitude},
      // {latitude: 14.537752, longitude: 121.001381},
      {latitude: riderLocation.latitude, longitude: riderLocation.longitude},
    );
    let distanceMiles = convertDistance(distance, 'mi');
    let duration = distanceMiles / 40;
    let hours = 20 / 60;
    let final = (duration + hours).toFixed(2);

    return moment(startTime).add(final, 'hours').format('hh:mm A');
  };

  const convertMinsToTime = (mins) => {
    let hours = Math.floor(mins / 60);
    let minutes = mins % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}hrs:${minutes}mins`;
  };

  const onSeeDetails = () => {
    navigation.navigate('ToktokFoodOrderDetails', {referenceNum});
  };

  const renderAddress = () => (
    <View style={styles.addressContainer}>
      <View>
        <FIcon5 name="circle" color={COLORS.YELLOWTEXT} size={15} />
        <View style={styles.divider} />
        {riderDetails != null && (orderStatus == 'f' || orderStatus == 's') ? (
          <MaterialIcon name="lens" size={16} color={COLORS.YELLOWTEXT} />
        ) : (
          <FIcon5 name="circle" color={COLORS.YELLOWTEXT} size={15} />
        )}
      </View>
      <View style={styles.addressInfo}>
        <Text numberOfLines={1}>{`${shopDetails.shopname} (${shopDetails.address})`}</Text>
        <View style={styles.horizontalContainer}>
          <View style={styles.horizontalDivider} />
        </View>
        <Text numberOfLines={1}>{address}</Text>
      </View>
    </View>
  );

  const renderTitle = () => {
    let startTime = moment(date).format('LT');
    let endTime = riderDetails != null ? calculateDistance(date, riderDetails.location) : '00:00'
  
    return (
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{status.title}</Text>
        <Text style={styles.status}>{status.message}</Text>
        {riderDetails != null && (
          <View style={styles.timeContainer}>
            <MaterialIcon name="schedule" size={16} color={COLORS.YELLOWTEXT} />
            <Text style={styles.time}>{`Estimated Delivery Time: ${startTime} - ${endTime}`}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderActions = () => (
    <View style={styles.actionContainer}>
      <TouchableOpacity onPress={onSeeDetails} style={styles.orderDetailsAction}>
        <Text style={styles.orderDetailsText}>See Order Details</Text>
      </TouchableOpacity>
      {orderStatus === 'p' && (
        <TouchableOpacity onPress={() => onCancel()} style={styles.cancelButton}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderTitle()}
      {renderAddress()}
      {renderActions()}
    </View>
  );
};

export default DriverDetailsView;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  actionContainer: {
    paddingBottom: 12,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  addressContainer: {
    backgroundColor: 'white',
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderColor: 'whitesmoke',
    flexDirection: 'row',
    padding: moderateScale(20),
    paddingHorizontal: moderateScale(30),
  },
  addressInfo: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
  },
  detailsContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowColor: '#000',
    elevation: 4,
    shadowOpacity: 0.1,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  divider: {
    flex: 1,
    borderWidth: 0.4,
    alignSelf: 'center',
    borderColor: '#DDDDDD',
  },
  horizontalContainer: {
    paddingVertical: verticalScale(15),
  },
  horizontalDivider: {
    borderColor: '#DDDDDD',
    borderWidth: 0.4,
    flex: 1,
  },
  orderDetailsText: {
    color: COLORS.YELLOWTEXT,
    fontWeight: '400',
    fontSize: 16,
    textAlign: 'center',
  },
  status: {
    fontWeight: '300',
    marginTop: verticalScale(5),
  },
  seeOrderDetails: {
    padding: moderateScale(20),
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
  cancelButton: {
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZE.BUTTON_HEIGHT,
    width: getDeviceWidth - 28,
    backgroundColor: COLOR.YELLOW,
  },
  buttonText: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  orderDetailsAction: {
    marginVertical: 16,
  },
});
