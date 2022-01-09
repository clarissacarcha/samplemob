/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import TimerModal from 'toktokfood/components/TimerModal';
import {useIsFocused} from '@react-navigation/native';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT, SIZE, COLOR} from 'res/variables';
import {time} from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';
import {orderStatusMessagePickUp, orderStatusMessageDelivery} from 'toktokfood/helper/orderStatusMessage';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {getDuration} from 'toktokfood/helper/index';
import {
  saveEstimatedDeliveryTime,
  getEstimatedDeliveryTime,
  removeEstimatedDeliveryTime,
  changeDateToday,
  processGetEDT,
  convertEDT,
} from 'toktokfood/helper/estimatedDeliveryTime';

const OrderTitle = ({transaction, riderDetails, referenceNum}) => {
  const [additionalMins, setAdditionalMins] = useState(0);
  const [newETA, setNewETA] = useState(false);
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
    dateFulfilled,
  } = transaction;
  const {location} = useSelector(state => state.toktokFood);
  const status =
    orderIsfor == 1
      ? orderStatusMessageDelivery(orderStatus, riderDetails, `${shopDetails?.shopname} (${shopDetails.address})`)
      : orderStatusMessagePickUp(orderStatus, riderDetails, `${shopDetails?.shopname} (${shopDetails.address})`);

  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('');
  const [etaMinutes, setEtaMinutes] = useState(0);
  const minutesInHours = 60;

  // const isFocus = useIsFocused();

  useEffect(() => {
    if (orderStatus == 'po' || orderStatus == 'rp' || orderStatus == 'f') {
      if (orderStatus == 'rp') {
        setAdditionalMins(20);
      }
      if (orderStatus == 'f') {
        setAdditionalMins(0);
      }
      setNewETA(true);
    }
  }, [transaction]);

  const handleProcessGetEDT = async (date, location) => {
    let result = await processGetEDT(date, referenceNum);
    if (result != null) {
      setEstimatedDeliveryTime(result);
    } else {
      setAdditionalMins(20);
      setNewETA(true);
      calculateEstimatedDeliveryTime(date, location);
    }
  };

  const calculateEstimatedDeliveryTime = (date, originLocation) => {
    if (newETA) {
      getDuration(originLocation, {latitude, longitude}).then(async durationSecs => {
        setNewETA(false);
        let durationHours = durationSecs != undefined ? parseFloat(durationSecs / (60 * 60)) : 0.0166667;
        let addMins = additionalMins / minutesInHours;
        let additionalHours = (durationHours + addMins).toFixed(2);
        let edtDate = estimatedDeliveryTime ? convertEDT(date, estimatedDeliveryTime) : date;
        let hoursDifference = moment().diff(edtDate, 'hours', true);
        let finalHrs = hoursDifference ? parseFloat(additionalHours) + parseFloat(hoursDifference) : additionalHours;
        let edt = moment(edtDate).add(finalHrs, 'hours').format('h:mm A');
        let edtAddMinutes = moment(edtDate).add(5, 'minutes').format('h:mm A');
        const secToMinutes = durationSecs / 60 + 5;
        console.log(durationHours, date, edt, additionalHours, 'ORDER DETAILS ETA', Math.ceil(secToMinutes));

        setEtaMinutes(Math.ceil(secToMinutes));
        processSaveEDT(edtAddMinutes);
        setEstimatedDeliveryTime(edtAddMinutes);
      });
    }
  };

  const processSaveEDT = async edt => {
    await saveEstimatedDeliveryTime(referenceNum, edt);
  };

  const renderEstimatedPickUpTime = () => {
    let startTime = moment(dateOrderProcessed).format('LT');
    let endTime = moment(dateOrderProcessed).add(20, 'minutes').format('hh:mm A');
    return (
      <View style={styles.timeContainer}>
        <Image resizeMode="contain" source={time} style={styles.timeImg} />
        {/* <Text style={styles.time}>{`Estimated Pickup Time: ${startTime} - ${endTime}`}</Text> */}
        <Text style={styles.time}>{`Estimated Pickup Time: ${moment(dateOrderProcessed).format('ll')} - ASAP`}</Text>
      </View>
    );
  };

  const dateByOrderStatus = () => {
    if (orderStatus == 'po') {
      return moment(dateOrderProcessed).isSame(moment(), 'day')
        ? dateOrderProcessed
        : changeDateToday(dateOrderProcessed);
    } else if (orderStatus == 'rp') {
      let date = moment(dateReadyPickup).isValid() ? dateReadyPickup : dateBookingConfirmed;
      return moment(date).isSame(moment(), 'day') ? date : changeDateToday(date);
    } else {
      return moment(dateFulfilled).isSame(moment(), 'day') ? dateFulfilled : changeDateToday(dateFulfilled);
    }
  };

  const renderEstimatedDeliveryTime = () => {
    let date = dateByOrderStatus();
    let shopLocation = {latitude: shopDetails.latitude, longitude: shopDetails.longitude};
    let location = riderDetails != null && orderStatus == 'f' ? riderDetails.location : shopLocation;
    let startTime = moment(date).format('LT');
    estimatedDeliveryTime == '' ? handleProcessGetEDT(date, location) : calculateEstimatedDeliveryTime(date, location);

    const getTimeByStatus = status => {
      switch (status) {
        case 'po':
          return '45 Minutes';
        case 'f':
          return `${etaMinutes} Minutes`;
        default:
          return '45 Minutes';
      }
    };

    if (!moment(date).isValid() && estimatedDeliveryTime == '') {
      return null;
    }
    return (
      <View style={styles.timeContainer}>
        <Image resizeMode="contain" source={time} style={styles.timeImg} />
        <Text style={styles.time}>{`Estimated Delivery Time: ${getTimeByStatus(orderStatus)}`}</Text>
        {/* <Text style={styles.time}>{`Estimated Delivery Time: ${startTime} - ${endTime}`}</Text> */}
        {/* <Text style={styles.time}>{`Estimated Delivery Time: ${moment(date).format(
          'll',
        )} - ${estimatedDeliveryTime}`}</Text> */}
      </View>
    );
  };

  const onCallBack = () => {
    setNewETA(true);
    if (orderStatus == 'po' || orderStatus == 'rp') {
      setAdditionalMins(orderStatus == 'po' ? 10 : 15);
    } else {
      setAdditionalMins(0.1);
    }
  };

  return (
    <View style={styles.detailsContainer}>
      {orderStatus != 'p' && orderStatus != 's' && orderStatus != 'c' && (
        <TimerModal
          orderStatus={orderStatus}
          estimatedDeliveryTime={estimatedDeliveryTime}
          hasRider={riderDetails != null}
          onCallBack={onCallBack}
        />
      )}
      <Text style={styles.orderDetailsText}>Order Details</Text>
      <Text style={styles.title}>{status.title}</Text>
      {!!status.message && <Text style={styles.status}>{status.message}</Text>}
      {transaction.orderIsfor == 2 &&
        orderStatus != 'p' &&
        orderStatus != 'c' &&
        orderStatus != 's' &&
        renderEstimatedPickUpTime()}
      {transaction.orderIsfor == 1 &&
        orderStatus != 'p' &&
        orderStatus != 'c' &&
        orderStatus != 's' &&
        renderEstimatedDeliveryTime()}
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
    marginHorizontal: moderateScale(30),
    textAlign: 'center',
  },
  time: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    marginLeft: moderateScale(5),
  },
  timeContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(5),
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  timeImg: {
    width: moderateScale(13),
    height: moderateScale(13),
    // tintColor: COLOR.DARK,
    resizeMode: 'contain',
    tintColor: '#F6A100',
  },
  orderDetailsText: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
    marginBottom: moderateScale(20),
    marginTop: moderateScale(10),
  },
});
