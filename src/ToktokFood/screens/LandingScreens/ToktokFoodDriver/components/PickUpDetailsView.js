/* eslint-disable react-hooks/exhaustive-deps */
import React, {useMemo, useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// Components
import DialogMessage from 'toktokfood/components/DialogMessage';
import Separator from 'toktokfood/components/Separator';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT, SIZE, COLOR} from 'res/variables';
import {time} from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';
import {orderStatusMessagePickUp, isPastOrder} from 'toktokfood/helper/orderStatusMessage';

import moment from 'moment';

const PickUpDetailsView = ({transaction, riderDetails, referenceNum, onCancel}) => {
  const navigation = useNavigation();
  const {showError} = useSelector(state => state.toktokFood.exhaust);
  const [etaMinutes, setEtaMinutes] = useState(0);
  const [showModal, setShowModal] = useState(false);
  // const [showError, setShowError] = useState(false);

  // const {location} = useSelector(state => state.toktokFood);
  const {shopDetails, orderStatus, isconfirmed, address, dateOrderProcessed, dateReadyPickup, isdeclined, dateOrdered} =
    transaction;
  const status = orderStatusMessagePickUp(
    orderStatus,
    dateOrdered,
    // riderDetails,
    // `${shopDetails.shopname} (${shopDetails.address})`,
    // isdeclined
  );
  const date = orderStatus === 'po' ? dateOrderProcessed : dateReadyPickup;

  // useEffect(() => {
  //   // Set Eta Minutes if rider picked up the order and on the way
  //   if (orderStatus === 'po' && etaMinutes === 43) {
  //     // const edt = moment(date, 'YYYY-MM-DD HH:mm:ss').add(1, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  //     // const timeNow = moment().format('YYYY-MM-DD HH:mm:ss');
  //     // if (edt <= timeNow) {
  //     //   setShowModal(true);
  //     // }
  //     setShowModal(true);
  //     // setEtaMinutes(60);
  //   }

  //   // console.log(etaMinutes, orderStatus);
  // }, [orderStatus, etaMinutes]);

  // useEffect(() => {
  //   if (etaMinutes > 0) {
  //     setTimeout(() => {
  //       setEtaMinutes(etaMinutes - 1);
  //       console.log('etaMinutes', etaMinutes);
  //     }, 60000);
  //   }
  //   return () => clearTimeout();
  // }, [etaMinutes]);

  // const onSetBackgroundTimer = () => {
  //   console.log(date);
  // };

  const onSeeDetails = () => {
    navigation.navigate('ToktokFoodOrderDetails', {referenceNum});
  };

  const isShowIcon = useMemo(() => {
    // return orderStatus !== 'p' || false;
    return true;
  }, [orderStatus]);

  const renderEstimatedTime = () => {
    const getTimeByStatus = () => {
      switch (orderStatus) {
        case 'p':
          return 'Estimated Pickup Time: ASAP';
        case 'po':
        case 'rp':
          if (showError) {
            return 'Sorry, your order seems to be taking too long to prepare. Thank you for patiently waiting.';
          }
          return 'Estimated Pickup Time: 15-45 minutes';
        default:
          return '';
      }
    };

    if (isShowIcon) {
      return (
        <View style={styles.timeContainer}>
          <Image resizeMode="contain" source={time} style={styles.timeImg} />
          <Text numberOfLines={2} style={styles.time}>
            {getTimeByStatus()}
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderAddress = () => {
    return (
      <View style={styles.addressContainer}>
        <View style={[styles.addressInfo, {flexShrink: 1}]}>
          <Text numberOfLines={1} style={styles.bodyText}>
            Restaurant
          </Text>
          <Text numberOfLines={1} style={{flexShrink: 1}}>{`${shopDetails.shopname} (${shopDetails.address})`}</Text>
        </View>
        {/* {orderStatus !== 'c' && orderStatus !== 's' && renderEstimatedTime()} */}
      </View>
    );
  };

  const renderTitle = () => {
    return (
      <View style={styles.detailsContainer}>
        {/* <Text style={styles.title}>{status.title}</Text> */}
        <Text numberOfLines={4} style={{...styles.status, color: isPastOrder(dateOrdered) ? '#FD0606' : COLORS.DARK}}>
          {status.message}
        </Text>

        {renderEstimatedTime()}
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

      {/* <DialogMessage
        visibility={showModal}
        title="Still Preparing Order"
        messages="Sorry, your order seems to be taking too long to prepare. Thank you for patiently waiting."
        type="warning"
        onCloseModal={() => {
          // setShowError(true);
          setShowModal(false);
          setEtaMinutes(45);
        }}
      /> */}
    </View>
  );
};

export default PickUpDetailsView;

const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(10),
    overflow: 'hidden',
    flex: 1,
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
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
  },
  addressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(20),
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
    fontWeight: '300',
    marginVertical: verticalScale(5),
    marginHorizontal: moderateScale(30),
    textAlign: 'center',
  },
  seeOrderDetails: {
    padding: moderateScale(20),
  },
  title: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  cancelButton: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZE.BUTTON_HEIGHT,
    width: '90%',
    backgroundColor: COLOR.YELLOW,
    marginTop: moderateScale(16),
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
    fontSize: FONT_SIZE.M,
    paddingRight: moderateScale(10),
  },
  time: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    fontWeight: 'bold',
    marginLeft: moderateScale(5),
    // marginTop: verticalScale(2),
    textAlign: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(15),
    width: '95%',
    // marginTop: verticalScale(10),
  },
  timeImg: {
    width: moderateScale(13),
    height: moderateScale(13),
    marginTop: 2,
    resizeMode: 'contain',
    tintColor: '#F6A100',
  },
});
