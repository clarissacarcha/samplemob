import React from 'react';
import {Platform, ScrollView, StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {getDistance, convertDistance} from 'geolib';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT, SIZE, COLOR} from 'res/variables';
import { time } from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';
import {orderStatusMessageDelivery} from 'toktokfood/helper/orderStatusMessage';
import moment from 'moment';
import DashedLine from 'react-native-dashed-line';

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

  const renderDash = () => (
    <View style={styles.dashedLine}>
      <DashedLine axis="vertical" dashGap={2} dashColor="#DDDDDD" dashLength={3} />
    </View>
  );

  const renderAddress = () => (
    <View style={styles.addressContainer}>
      <View>
        <FIcon5 name="circle" color={COLORS.YELLOWTEXT} size={15} />
        {/* <View style={styles.divider} /> */}
        {renderDash()}
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
            <Image resizeMode="contain" source={time} style={styles.timeImg} />
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
      <View style={styles.shadow}>
        {renderTitle()}
        {renderAddress()}
        {renderActions()}
      </View>
    </View>
  );
};

export default DriverDetailsView;

const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(10),
    overflow: 'hidden',
    flex: 1
  },
  actionContainer: {
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
  shadow: {
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
    elevation: 5,
    shadowOpacity: 0.1,
  },
  detailsContainer: {
    alignItems: 'center',
    paddingBottom: moderateScale(15)
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
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
    textAlign: 'center',
  },
  status: {
    fontSize: FONT_SIZE.M,
    marginTop: verticalScale(5),
  },
  seeOrderDetails: {
    padding: moderateScale(20),
  },
  time: {
    fontSize: FONT_SIZE.S,
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
  cancelButton: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZE.BUTTON_HEIGHT,
    width: '90%',
    backgroundColor: COLOR.YELLOW,
  },
  buttonText: {
    color: COLOR.WHITE,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  orderDetailsAction: {
    marginVertical: 16,
  },
  timeImg: {
    width: moderateScale(13),
    height: moderateScale(13),
    tintColor: COLOR.DARK,
    resizeMode: 'contain',
    tintColor: '#F6A100'
  },
  dashedLine: {
    paddingLeft: moderateScale(6),
    flex: 1,
    flexDirection: 'row'
  },
});
