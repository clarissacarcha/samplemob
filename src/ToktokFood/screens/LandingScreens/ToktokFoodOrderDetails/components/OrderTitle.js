/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import TimerModal from 'toktokfood/components/TimerModal';
// import {useIsFocused} from '@react-navigation/native';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT, SIZE, COLOR} from 'res/variables';
import {time} from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';
import {orderStatusMessagePickUp, orderStatusMessageDelivery} from 'toktokfood/helper/orderStatusMessage';
import moment from 'moment';
import {useSelector} from 'react-redux';
// import {getDuration} from 'toktokfood/helper/index';
import {
  // saveEstimatedDeliveryTime,
  // getEstimatedDeliveryTime,
  // removeEstimatedDeliveryTime,
  changeDateToday,
  // processGetEDT,
  // convertEDT,
} from 'toktokfood/helper/estimatedDeliveryTime';

const OrderTitle = ({transaction, riderDetails, referenceNum}) => {
  const [additionalMins, setAdditionalMins] = useState(0);
  const [newETA, setNewETA] = useState(false);
  const {
    // latitude,
    // longitude,
    shopDetails,
    orderStatus,
    // isconfirmed,
    // address,
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
  // const minutesInHours = 60;
  // const isFocus = useIsFocused();

  useEffect(() => {
    // Set Eta Minutes if rider picked up the order and on the way
    if (transaction?.orderStatus === 'rp' && riderDetails && etaMinutes === 0) {
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

  const onSetEta = () => {
    const {deliveryLogs, duration} = riderDetails;
    const pickupDate = deliveryLogs.filter(log => log.status === 4);
    const addedMinutes = duration + 5;

    if (pickupDate.length) {
      const edt = moment(pickupDate[0].createdAt).add(addedMinutes, 'minutes').format('YYYY-MM-DD');
      const minutesDiff = moment().diff(edt, 'minutes', true);
      setEtaMinutes(parseInt(minutesDiff));
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
        if (edt !== dateNow && edtTime <= timeNow) {
          return 'Rider is nearby your location. Thank you for patiently waiting.';
        }
      }
      return `Estimated Delivery Time: ${etaMinutes} Minutes`;
    }
  });

  // useEffect(() => {
  //   if (orderStatus == 'po' || orderStatus == 'rp' || orderStatus == 'f') {
  //     if (orderStatus == 'rp') {
  //       setAdditionalMins(20);
  //     }
  //     if (orderStatus == 'f') {
  //       setAdditionalMins(0);
  //     }
  //     setNewETA(true);
  //   }
  // }, [transaction]);

  // useEffect(() => {
  //   return () => setNewETA(false);
  // }, []);

  // const handleProcessGetEDT = async (date, location) => {
  //   let result = await processGetEDT(date, referenceNum);
  //   if (result != null) {
  //     setEstimatedDeliveryTime(result);
  //   } else {
  //     setAdditionalMins(20);
  //     setNewETA(true);
  //     calculateEstimatedDeliveryTime(date, location);
  //   }
  // };

  // const calculateEstimatedDeliveryTime = (date, originLocation) => {
  //   if (newETA) {
  //     getDuration(originLocation, {latitude, longitude}).then(async durationSecs => {
  //       let durationHours = durationSecs != undefined ? parseFloat(durationSecs / (60 * 60)) : 0.0166667;
  //       let addMins = additionalMins / minutesInHours;
  //       let additionalHours = (durationHours + addMins).toFixed(2);
  //       let edtDate = estimatedDeliveryTime ? convertEDT(date, estimatedDeliveryTime) : date;
  //       let hoursDifference = moment().diff(edtDate, 'hours', true);
  //       let finalHrs = hoursDifference ? parseFloat(additionalHours) + parseFloat(hoursDifference) : additionalHours;
  //       let edt = moment(edtDate).add(finalHrs, 'hours').format('h:mm A');
  //       let edtAddMinutes = moment(edtDate).add(5, 'minutes').format('h:mm A');
  //       const secToMinutes = durationHours / 60 + 5;
  //       // console.log(durationHours, date, edt, additionalHours, 'ORDER DETAILS ETA', Math.ceil(secToMinutes));
  //       // console.log(durationHours, durationSecs, secToMinutes);
  //       setEtaMinutes(Math.ceil(secToMinutes));
  //       processSaveEDT(edtAddMinutes);
  //       setEstimatedDeliveryTime(edtAddMinutes);
  //       setNewETA(false);
  //     });
  //   }
  // };

  // const processSaveEDT = async edt => {
  //   await saveEstimatedDeliveryTime(referenceNum, edt);
  // };

  const renderEstimatedPickUpTime = () => {
    const date = orderStatus === 'po' ? dateOrderProcessed : dateReadyPickup;
    const edt = moment(date, 'YYYY-MM-DD HH:mm:ss').add(45, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    const timeNow = moment().format('YYYY-MM-DD HH:mm:ss');

    const getTimeByStatus = () => {
      switch (orderStatus) {
        case 'po':
          if (edt <= timeNow) {
            return 'Sorry, your order seems to be taking too long to prepare. Thank you for patiently waiting.';
          }
          return 'Estimated Pickup Time: 15-45 Minutes';
        case 'rp':
          return 'Estimated Pickup Time: ASAP';
        default:
          return 'Estimated Pickup Time: 15-45 Minutes';
      }
    };
    return (
      <View style={styles.timeContainer}>
        <Image resizeMode="contain" source={time} style={styles.timeImg} />
        <Text style={styles.time}>{getTimeByStatus()}</Text>
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
    // let shopLocation = {latitude: shopDetails.latitude, longitude: shopDetails.longitude};
    // let location = riderDetails != null && orderStatus == 'f' ? riderDetails.location : shopLocation;
    // let startTime = moment(date).format('LT');
    // estimatedDeliveryTime == '' ? handleProcessGetEDT(date, location) : calculateEstimatedDeliveryTime(date, location);

    const getTimeByStatus = status => {
      switch (status) {
        case 'po':
          return 'Estimated Delivery Time: 15-45 Minutes';
        case 'rp':
          return onGetPickupDate();
        case 'f':
          return 'Rider is nearby your location. Thank you for patiently waiting.';
        // return `${etaMinutes} Minutes`;
        default:
          return 'Estimated Delivery Time: 15-45 Minutes';
      }
    };

    if (!moment(date).isValid()) {
      return null;
    }
    return (
      <View style={styles.timeContainer}>
        <Image resizeMode="contain" source={time} style={styles.timeImg} />
        <Text style={styles.time}>{getTimeByStatus(orderStatus)}</Text>
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
      {transaction.orderIsfor == 2 && orderStatus != 'c' && orderStatus != 's' && renderEstimatedPickUpTime()}
      {transaction.orderIsfor == 1 && orderStatus != 'c' && orderStatus != 's' && renderEstimatedDeliveryTime()}
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
    textAlign: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    marginTop: moderateScale(5),
    // alignItems: 'center',
    paddingHorizontal: moderateScale(15),
  },
  title: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  timeImg: {
    width: moderateScale(13),
    height: moderateScale(13),
    // top: moderateScale(4),
    marginTop: moderateScale(2),
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
