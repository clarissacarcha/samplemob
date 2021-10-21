import React from 'react';
import {Platform, ScrollView, StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Separator from 'toktokfood/components/Separator';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT, SIZE, COLOR} from 'res/variables';
import { time } from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';
import {orderStatusMessagePickUp} from 'toktokfood/helper/orderStatusMessage';

import moment from 'moment';

const PickUpDetailsView = ({transaction, riderDetails, referenceNum, onCancel}) => {
  const navigation = useNavigation();
  const {location} = useSelector((state) => state.toktokFood);
  const {shopDetails, orderStatus, isconfirmed, address, dateOrderProcessed, dateReadyPickup, isdeclined} = transaction;
  const status = orderStatusMessagePickUp(
    orderStatus,
    riderDetails,
    `${shopDetails.shopname} (${shopDetails.address})`,
    isdeclined
  );
  const date = orderStatus == 'po' ? dateOrderProcessed : dateReadyPickup;

  const onSeeDetails = () => {
    navigation.navigate('ToktokFoodOrderDetails', {referenceNum});
  };

  const renderEstimatedTime = () => {
    let startTime = moment(dateOrderProcessed).format('LT');
    let endTime = moment(dateOrderProcessed).add(20, 'minutes').format('hh:mm A');
    return (
      <View style={styles.timeContainer}>
        <Image resizeMode="contain" source={time} style={styles.timeImg} />
        {/* <Text style={styles.time}>{`Estimated Delivery Time: ${startTime} - ${endTime}`}</Text> */}
        <Text style={styles.time}>{`Estimated Pickup Time: ${moment(dateOrderProcessed).format('ll')} - ASAP`}</Text>
      </View>
    );
  };

  const renderAddress = () => {
    return (
      <View style={styles.addressContainer}>
        <View style={[styles.addressInfo ]}>
          <Text numberOfLines={1} style={styles.bodyText}>
            Restaurant
          </Text>
          <Text numberOfLines={1}>{`${shopDetails.shopname} (${shopDetails.address})`}</Text>
        </View>
        {orderStatus != 'p' && orderStatus !== 'c' && orderStatus !== 's' && renderEstimatedTime()}
      </View>
    );
  };

  const renderTitle = () => {
    return (
      <View style={styles.detailsContainer}>
        {/* <Text style={styles.title}>{status.title}</Text> */}
        <Text style={styles.status}>{status.message}</Text>
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
        <Separator />
        {renderAddress()}
        <Separator />
        {renderActions()}
      </View>
    </View>
  );
};

export default PickUpDetailsView;

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
    borderColor: 'white',
    // flexDirection: 'row',
    paddingHorizontal: moderateScale(16),
  },
  addressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(20)
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
    elevation: 10,
    shadowOpacity: 0.1,
  },
  detailsContainer: {
    alignItems: 'center',
    paddingBottom: moderateScale(15),
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
    fontFamily: FONT.REGULAR,
    marginVertical: verticalScale(5),
  },
  seeOrderDetails: {
    padding: moderateScale(20),
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
    marginTop: moderateScale(16)
  },
  buttonText: {
    color: COLOR.WHITE,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  orderDetailsAction: {
    marginTop: moderateScale(16),
  },
  bodyText: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M
  },
  time: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    marginLeft: moderateScale(5),
  },
  timeContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(10),
    alignItems: 'center',
    justifyContent: 'center'
  },
  timeImg: {
    width: moderateScale(13),
    height: moderateScale(13),
     resizeMode: 'contain',
    tintColor: '#F6A100'
  },
});
