import React, {useState, useEffect, useCallback} from 'react';
import {Platform, ScrollView, StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {getDistance, convertDistance} from 'geolib';

// Components
import Separator from 'toktokfood/components/Separator';
import TimerModal from 'toktokfood/components/TimerModal';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT, SIZE, COLOR} from 'res/variables';
import { time } from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';
import {orderStatusMessageDelivery} from 'toktokfood/helper/orderStatusMessage';
import {getDuration} from 'toktokfood/helper/index';

import moment from 'moment';
import DashedLine from 'react-native-dashed-line';
import {
  saveEstimatedDeliveryTime,
  getEstimatedDeliveryTime,
  removeEstimatedDeliveryTime,
  changeDateToday,
  processGetEDT,
  convertEDT
} from 'toktokfood/helper/estimatedDeliveryTime';

const DriverDetailsView = ({transaction, riderDetails, referenceNum, onCancel}) => {
  const navigation = useNavigation();
  const {location} = useSelector((state) => state.toktokFood);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('');
  const [additionalMins, setAdditionalMins] = useState(0);
  const [newETA, setNewETA] = useState(false);
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
    longitude
  } = transaction;
  const status = orderStatusMessageDelivery(
    orderStatus,
    riderDetails,
    `${shopDetails.shopname} (${shopDetails.address})`,
    isdeclined
  );
  const minutesInHours = 60;
  const isFocus = useIsFocused();

  useEffect(() => {
    if(isFocus && estimatedDeliveryTime != ''){
      let edt = moment(estimatedDeliveryTime, 'h:mm a')
      if(moment().isAfter(edt)){
        setNewETA(true)
      }
    }
  }, [isFocus])

  useEffect(() => {
    if((orderStatus == 'po' || orderStatus == 'rp' || orderStatus == 'f') && estimatedDeliveryTime != ''){
      if(orderStatus == 'rp'){
        setAdditionalMins(20)
      }
      setNewETA(true)
    }
  }, [transaction])

  const handleProcessGetEDT = async(date, location) =>{ 
    // await removeEstimatedDeliveryTime()
    let result = await processGetEDT(date, referenceNum);
    if(result != null){
      setEstimatedDeliveryTime(result)
    } else {
      setAdditionalMins(20)
      setNewETA(true)
      calculateEstimatedDeliveryTime(date, location)
    }
  }

  const calculateEstimatedDeliveryTime = (date, originLocation) => {
    if(newETA){
      getDuration(originLocation, {latitude, longitude})
        .then(async(durationSecs) => {
          setNewETA(false)
          let durationHours = Math.floor(durationSecs / (60 * 60));
          let addMins = (riderDetails != null && orderStatus == 'f') ? 0 : (additionalMins / minutesInHours);
          let additionalHours = (durationHours + addMins).toFixed(2);
          let edtDate = estimatedDeliveryTime ? convertEDT(date, estimatedDeliveryTime) : date
          let hoursDifference = moment().diff(edtDate, 'hours', true)
          let finalHrs = hoursDifference ? parseFloat(additionalHours) + parseFloat(hoursDifference) : additionalHours
          let edt = moment(edtDate).add(finalHrs, 'hours').format('h:mm A')
          processSaveEDT(edt)
          setEstimatedDeliveryTime(edt)
        })
    }
  };

  const processSaveEDT = async(edt) => {
    await saveEstimatedDeliveryTime(referenceNum, edt)
  }

  const onSeeDetails = () => {
    navigation.navigate('ToktokFoodOrderDetails', {referenceNum});
  };

  const renderDash = () => (
    <View style={styles.dashedLine}>
      <DashedLine axis="vertical" dashGap={2} dashColor="#DDDDDD" dashLength={3} />
    </View>
  );

  const renderAddress = () => (
    <>
    <View style={styles.addressContainer}>
      <View>
        <FIcon5 name="circle" color={COLORS.YELLOWTEXT} size={15} />
        {/* <View style={styles.divider} /> */}
        {renderDash()}
        {(riderDetails != null && (orderStatus == 'f' || orderStatus == 's')) ? (
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
    </>
  );

  const dateByOrderStatus = () => {
    if(orderStatus == 'po'){
      return moment(dateOrderProcessed).isSame(moment(), 'day') ? dateOrderProcessed : changeDateToday(dateOrderProcessed)
    } else if(orderStatus == 'rp'){
      let date = moment(dateReadyPickup).isValid() ? dateReadyPickup : dateBookingConfirmed;
      return moment(date).isSame(moment(), 'day') ? date : changeDateToday(date)
    } else {
      return moment(dateFulfilled).isSame(moment(), 'day') ? dateFulfilled : changeDateToday(dateFulfilled)
    }
  }

  const displayEstimatedDeliveryTime = () => {
    let date = dateByOrderStatus();
    let shopLocation = { latitude: shopDetails.latitude, longitude: shopDetails.longitude };
    let location = (riderDetails != null && orderStatus == 'f') ? riderDetails.location : shopLocation
    let startTime = moment(date).format('LT');
    estimatedDeliveryTime == '' ? handleProcessGetEDT(date, location) : calculateEstimatedDeliveryTime(date, location)
    if(!moment(date).isValid() && estimatedDeliveryTime == ''){
      return null
    }
    return (
      <View style={styles.timeContainer}>
        <Image resizeMode="contain" source={time} style={styles.timeImg} />
        {/* <Text style={styles.time}>{`Estimated Delivery Time: ${startTime} - ${endTime}`}</Text> */}
        <Text style={styles.time}>
          {`Estimated Delivery Time: ${moment(date).format('ll')} - ${estimatedDeliveryTime}`}
        </Text>
      </View>
    )
  }

  const renderTitle = () => {
    return (
      <View style={styles.detailsContainer}>
        {(status.id == 'f' || status == 's') && (
          <Text style={styles.title}>{status.title}</Text>
        )}
        <Text style={styles.status}>{status.message}</Text>
        {(orderStatus != 'p' && orderStatus != 'c' && orderStatus != 's') && displayEstimatedDeliveryTime() }
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
    setNewETA(true)
    if(orderStatus == 'po' || orderStatus == 'rp'){
      setAdditionalMins(orderStatus == 'po' ? 10 : 15)
    } else {
      setAdditionalMins(0.1)
    }
  } 

  return (
    <View style={styles.container}>
      {(orderStatus != 'p' && orderStatus != 's' && orderStatus != 'c') && (
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
    flex: 1
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
    marginVertical: verticalScale(5),
  },
  seeOrderDetails: {
    padding: moderateScale(20),
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
