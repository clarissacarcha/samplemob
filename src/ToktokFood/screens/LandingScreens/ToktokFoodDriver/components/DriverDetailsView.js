/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {Platform, ScrollView, StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {getDistance, convertDistance} from 'geolib';
import BackgroundTimer from 'react-native-background-timer';

// Components
import Separator from 'toktokfood/components/Separator';
import TimerModal from 'toktokfood/components/TimerModal';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT, SIZE, COLOR} from 'res/variables';
import {time} from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';
import {orderStatusMessageDelivery, isPastOrder} from 'toktokfood/helper/orderStatusMessage';
import {getDuration} from 'toktokfood/helper/index';

import moment from 'moment';
import DashedLine from 'react-native-dashed-line';
import {
  saveEstimatedDeliveryTime,
  getEstimatedDeliveryTime,
  removeEstimatedDeliveryTime,
  changeDateToday,
  processGetEDT,
  convertEDT,
} from 'toktokfood/helper/estimatedDeliveryTime';

const DriverDetailsView = ({eta, transaction, riderDetails, referenceNum, onCancel}) => {
  const navigation = useNavigation();
  const {location} = useSelector(state => state.toktokFood);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('');
  const [additionalMins, setAdditionalMins] = useState(0);
  const [etaMinutes, setEtaMinutes] = useState(0);
  const [newETA, setNewETA] = useState(false);
  const [newStartDateTime, setNewStartDateTime] = useState(null);
  const {
    shopDetails,
    orderStatus,
    isconfirmed,
    address,
    dateReadyPickup,
    dateBookingConfirmed,
    dateOrderProcessed,
    isdeclined,
    dateFulfilled,
    latitude,
    longitude,
    dateOrdered,
  } = transaction;
  const status = orderStatusMessageDelivery(
    orderStatus,
    dateOrdered,
    address,
    // riderDetails,
    // `${shopDetails.shopname} (${shopDetails.address})`,
    // isdeclined,
  );
  const minutesInHours = 60;
  const isFocus = useIsFocused();

  useEffect(() => {
    // Set Eta Minutes if rider picked up the order and on the way
    if (transaction?.orderStatus === 'f' && riderDetails && etaMinutes === 0) {
      onSetEta();
    }

    return () => clearInterval();
  }, [riderDetails, transaction]);

  useEffect(() => {
    if (etaMinutes > 0) {
      setTimeout(() => {
        setEtaMinutes(etaMinutes - 1);
      }, 60000);
    }
    return () => clearTimeout();
  });

  // useEffect(() => {
  //   if (isFocus && estimatedDeliveryTime != '') {
  //     let edt = moment(estimatedDeliveryTime, 'h:mm a');
  //     if (moment().isAfter(edt)) {
  //       setNewETA(true);
  //     }
  //   }
  // }, [isFocus]);

  // useEffect(() => {
  //   if ((orderStatus === 'po' || orderStatus === 'rp' || orderStatus === 'f') && estimatedDeliveryTime !== '') {
  //     if (orderStatus === 'rp') {
  //       setAdditionalMins(20);
  //     }
  //     if (orderStatus === 'f') {
  //       setAdditionalMins(0);
  //     }
  //     setNewETA(true);
  //   }
  // }, [transaction]);
  // console.log(riderDetails, transaction);

  // const handleProcessGetEDT = async (date, location) => {
  //   // await removeEstimatedDeliveryTime()
  //   let result = await processGetEDT(date, referenceNum);
  //   // console.log('results', result, date, referenceNum);
  //   if (result != null) {
  //     // console.log('NOT NULLL');
  //     setEstimatedDeliveryTime(result);
  //   } else {
  //     // console.log('NULLL');
  //     setAdditionalMins(20);
  //     setNewETA(true);
  //     calculateEstimatedDeliveryTime(date, location);
  //   }
  // };

  // const calculateEstimatedDeliveryTime = (date, originLocation) => {
  //   // console.log('calculateEstimatedDeliveryTime', newETA);
  //   if (newETA) {
  //     getDuration(originLocation, {latitude, longitude}).then(async durationSecs => {
  //       setNewETA(false);
  //       let durationHours = durationSecs != undefined ? parseFloat(durationSecs / (60 * 60)) : 0.0166667;
  //       let addMins = additionalMins / minutesInHours;
  //       let additionalHours = (durationHours + addMins).toFixed(2);
  //       let edtDate = estimatedDeliveryTime ? convertEDT(date, estimatedDeliveryTime) : date;
  //       let hoursDifference = moment().diff(edtDate, 'hours', true);
  //       let finalHrs = hoursDifference ? parseFloat(additionalHours) + parseFloat(hoursDifference) : additionalHours;
  //       let edt = moment(edtDate).add(finalHrs, 'hours').format('h:mm A');
  //       const secToMinutes = durationSecs / 60 + 5;
  //       // console.log({
  //       //   durationHours,
  //       //   addMins,
  //       //   additionalMins,
  //       //   minutesInHours,
  //       //   additionalHours,
  //       //   edtDate,
  //       //   estimatedDeliveryTime,
  //       //   hoursDifference,
  //       //   finalHrs,
  //       //   edt,
  //       //   durationSecs,
  //       //   date,
  //       // });
  //       setEtaMinutes(Math.ceil(secToMinutes));
  //       processSaveEDT(edt);
  //       setEstimatedDeliveryTime(edt);
  //     });
  //   }
  // };

  // const processSaveEDT = async edt => {
  //   await saveEstimatedDeliveryTime(referenceNum, edt);
  // };

  const onSetEta = () => {
    const {deliveryLogs, duration} = riderDetails;
    const pickupDate = deliveryLogs.filter(log => log.status === 4);
    const addedMinutes = duration + 5;

    if (pickupDate.length) {
      const edt = moment(pickupDate[0].createdAt).add(addedMinutes, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      const minutesDiff = moment().diff(edt, 'minutes', true);
      const checkMinutes = parseInt(minutesDiff) < 0 ? parseInt(minutesDiff) * -1 : parseInt(minutesDiff);
      setEtaMinutes(checkMinutes);
    }
  };

  const onGetPickupDate = useCallback(() => {
    if (riderDetails) {
      const {deliveryLogs, duration} = riderDetails;
      const pickupDate = deliveryLogs.filter(log => log.status === 4);
      const addedMinutes = duration + 5;

      if (!pickupDate.length) {
        return 'Estimated Delivery Time: 15-45 Minutes';
      } else {
        const dateNow = moment().format('YYYY-MM-DD');
        const timeNow = moment().format('LT');
        const edt = moment(pickupDate[0].createdAt).add(addedMinutes, 'minutes').format('YYYY-MM-DD');
        const edtTime = moment(pickupDate[0].createdAt).add(addedMinutes, 'minutes').format('LT');
        // const minutesDiff = moment().diff(edt, 'minutes', true);
        // console.log('ETA', edt, dateNow, edtTime, timeNow);

        if (edt !== dateNow || edtTime <= timeNow) {
          return 'Rider is nearby your location. Thank you for patiently waiting.';
        }
      }
      return `Estimated Delivery Time: ${etaMinutes} Minutes`;
    }
  });

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

  const dateByOrderStatus = () => {
    if (orderStatus == 'po') {
      return moment(dateOrderProcessed).isSame(moment(), 'day')
        ? dateOrderProcessed
        : changeDateToday(dateOrderProcessed);
    } else if (orderStatus == 'rp') {
      let date = moment(dateReadyPickup).isValid() ? dateReadyPickup : dateBookingConfirmed;
      return moment(date).isSame(moment(), 'day') ? date : changeDateToday(date);
    } else {
      let date = moment(dateFulfilled).isSame(moment(), 'day') ? dateFulfilled : changeDateToday(dateFulfilled);
      return newStartDateTime != null ? newStartDateTime : date;
    }
  };

  const displayEstimatedDeliveryTime = () => {
    let date = dateByOrderStatus();
    // let shopLocation = {latitude: shopDetails.latitude, longitude: shopDetails.longitude};
    // let location = riderDetails != null && orderStatus == 'f' ? riderDetails.location : shopLocation;
    // let startTime = moment(date).format('LT');
    // estimatedDeliveryTime === '' ? handleProcessGetEDT(date, location) : calculateEstimatedDeliveryTime(date, location);

    if (!moment(date).isValid() && estimatedDeliveryTime == '') {
      return null;
    }

    const getTimeByStatus = status => {
      switch (status) {
        case 'po':
          return 'Estimated Delivery Time: 15-45 Minutes';
        case 'rp':
          return 'Estimated Delivery Time: 15-45 Minutes';
        // return onGetPickupDate();
        case 'f':
          return onGetPickupDate();
        // return 'Rider is nearby your location. Thank you for patiently waiting.';
        default:
          return 'Estimated Delivery Time: 15-45 Minutes';
      }
    };

    return (
      <View style={styles.timeContainer}>
        <Image resizeMode="contain" source={time} style={styles.timeImg} />
        <Text style={styles.time} numberOfLines={2}>
          {getTimeByStatus(orderStatus)}
        </Text>
        {/* <Text style={styles.time}>
          {`Estimated Delivery Time: ${moment(date).format('ll')} - ${estimatedDeliveryTime}`}
        </Text> */}
      </View>
    );
  };

  const renderTitle = () => {
    return (
      <View style={styles.detailsContainer}>
        {(status.id == 's' || status.id == 'c') && <Text style={styles.title}>{status.title}</Text>}
        {status.message != '' && (
          <Text numberOfLines={2} style={{...styles.status, color: isPastOrder(dateOrdered) ? '#FD0606' : COLORS.DARK}}>
            {status.message}
          </Text>
        )}
        {orderStatus !== 'c' && orderStatus !== 's' && displayEstimatedDeliveryTime()}
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

  const onCallBack = () => {
    setNewETA(true);
    if (orderStatus == 'po' || orderStatus == 'rp') {
      setAdditionalMins(orderStatus == 'po' ? 10 : 15);
    } else {
      // setAdditionalMins(0.1)
      let date = moment().format('YYYY-MM-DD HH:mm:ss');
      setNewStartDateTime(date);
    }
  };

  return (
    <View style={styles.container}>
      {orderStatus != 'p' && orderStatus != 's' && orderStatus != 'c' && (
        <TimerModal
          orderStatus={orderStatus}
          estimatedDeliveryTime={estimatedDeliveryTime}
          hasRider={riderDetails != null}
          onCallBack={onCallBack}
        />
      )}
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

export default DriverDetailsView;

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
    paddingBottom: moderateScale(20),
    paddingHorizontal: moderateScale(40),
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
    marginVertical: verticalScale(5),
    textAlign: 'center',
  },
  seeOrderDetails: {
    padding: moderateScale(20),
  },
  time: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    fontWeight: '600',
    marginLeft: moderateScale(5),
    marginTop: verticalScale(2),
    textAlign: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    // marginTop: verticalScale(5),
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(10),
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
  timeImg: {
    width: moderateScale(13),
    height: moderateScale(13),
    top: moderateScale(4),
    tintColor: COLOR.YELLOW,
    resizeMode: 'contain',
  },
  dashedLine: {
    paddingLeft: moderateScale(6),
    flex: 1,
    flexDirection: 'row',
  },
});
