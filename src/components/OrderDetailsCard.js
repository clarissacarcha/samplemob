/**
 * Displayed in Selected Delivery Details
 * Used to display Order Date, Order Type and Schedule
 */
import React from 'react';
import {View, Text, StyleSheet, Platform, Linking} from 'react-native';
import {COLOR, DARK, MEDIUM, ORANGE, LIGHT} from '../res/constants';
import moment from 'moment';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import EIcon from 'react-native-vector-icons/Entypo';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';

const SchedulePhrase = ({stop}) => {
  const nowDate = moment().format('MMM DD YYYY');
  const tomorrowDate = moment()
    .add(1, 'days')
    .format('MMM DD YYYY');
  const stopDate = moment(stop.scheduledFrom, 'MM/DD/YYYY - hh:mm A').format('MMM DD YYYY');

  let displayDate = stopDate;
  let fromDate = moment(stop.scheduledFrom, 'MM/DD/YYYY - hh:mm A').format('h:mm a');
  let toDate = moment(stop.scheduledTo, 'MM/DD/YYYY - hh:mm A').format('h:mm a');

  if (stopDate === nowDate) {
    displayDate = 'Today';
  }
  if (stopDate === tomorrowDate) {
    displayDate = 'Tomorrow';
  }

  if (fromDate === '12:00 am') {
    fromDate = 'Anytime';
  }

  if (toDate === '11:59 pm') {
    toDate = 'Anytime';
  }

  return (
    <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 11, fontWeight: 'bold'}}>
      {displayDate}
      <Text style={{color: COLOR}}> From </Text>
      {fromDate}
      <Text style={{color: COLOR}}> To </Text>
      {toDate}
    </Text>
  );
};

const DeliverySchedule = ({label, stop}) => {
  return (
    <View style={[styles.directionsBox, {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        {label == 'Pick Up' ? (
          <EIcon name="hand" size={14} color={'white'} style={styles.iconBox} />
        ) : (
          <FA5Icon name="hands-helping" size={12} color={'white'} style={styles.iconBox} />
        )}

        <View style={{marginLeft: 10}}>
          <Text style={{fontWeight: 'bold'}}>{label}</Text>
          {stop.orderType == 1 ? (
            <Text style={{color: MEDIUM, fontSize: 11, fontWeight: 'bold'}}>As Soon As Possible</Text>
          ) : (
            <SchedulePhrase stop={stop} />
          )}
        </View>
      </View>
    </View>
  );
};

export const OrderDetailsCard = ({delivery}) => {
  const {senderStop, recipientStop} = delivery;
  const legend = ['', 'As Soon As Possible', 'Scheduled'];
  const orderType = senderStop.orderType === 2 || recipientStop.orderType == 2 ? 2 : 1;

  return (
    <View style={styles.card}>
      <View style={styles.cardShadow}>
        {/*------------------- STOP LABEL-------------------*/}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: MEDIUM,
          }}>
          <FA5Icon name="file-alt" size={16} color={DARK} style={styles.iconBox} />
          <Text style={{marginLeft: 10, color: DARK, fontWeight: 'bold'}}>
            Order <Text style={{color: ORANGE}}>Details</Text>
          </Text>
        </View>

        {/*-------------------- ORDER AMOUNT --------------------*/}
        <View style={[styles.directionsBox, {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Ionicon name="md-pricetag" size={16} color={'white'} style={styles.iconBox} />

            <View style={{marginLeft: 10}}>
              <Text style={{fontWeight: 'bold'}}>Amount</Text>
              <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                <Text style={{fontWeight: 'bold', marginLeft: 10}}>₱ {delivery.price}.00</Text>
              </Text>
            </View>
          </View>
          {delivery.cashOnDelivery && (
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Ionicon name="md-pricetags" size={16} color={'white'} style={styles.iconBox} />

              <View style={{marginLeft: 10}}>
                <Text style={{fontWeight: 'bold'}}>Cash On Delivery</Text>
                <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                  <Text style={{fontWeight: 'bold', marginLeft: 10}}>₱ {delivery.cashOnDelivery}.00</Text>
                </Text>
              </View>
            </View>
          )}
        </View>

        <View
          style={[
            styles.directionsBox,
            {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT, paddingVertical: 10},
          ]}>
          <View style={styles.directionDetail}>
            {/*-------------------- ORDER DATE --------------------*/}
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <FAIcon name="calendar" size={14} color={'white'} style={styles.iconBox} />
              <View style={{marginLeft: 10}}>
                <Text style={{fontWeight: 'bold', fontSize: 14}}>Order Date</Text>
                <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 11, fontWeight: 'bold'}}>
                  {/* {moment
                    .tz(delivery.createdAt, 'Asia/Manila')
                    .format('MMM DD YYYY - hh:mm A')
                    .toString()} */}
                  {delivery.createdAt}
                </Text>
              </View>
            </View>

            {/*-------------------- ORDER TYPE --------------------*/}
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Fontisto name="sitemap" size={14} color={'white'} style={styles.iconBox} />
              <View style={{marginLeft: 10}}>
                <Text style={{fontWeight: 'bold'}}>Order Type</Text>
                <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 11, fontWeight: 'bold'}}>
                  {legend[orderType]}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/*------------------- SCHEDULE | DISPLAY ON ORDER TYPE = 2 -------------------*/}
        {orderType == 2 && (
          <>
            {/*-------------------- PICK UP --------------------*/}
            <DeliverySchedule label="Pick Up" stop={senderStop} />

            {/*-------------------- DELIVER --------------------*/}
            <DeliverySchedule label="Deliver" stop={recipientStop} />
          </>
        )}

        {/*-------------------- DISTANCE DURATION ROW --------------------*/}
        <View
          style={[
            styles.directionsBox,
            {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT, paddingVertical: 10},
          ]}>
          <View style={styles.directionDetail}>
            {/*-------------------- DISTANCE --------------------*/}
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <MCIcon name="map-marker-distance" size={16} color={'white'} style={styles.iconBox} />
              <View style={{marginLeft: 10}}>
                <Text style={{fontWeight: 'bold', fontSize: 14}}>Distance</Text>
                <Text style={{fontWeight: 'bold', color: MEDIUM, fontSize: 11}}>
                  {parseFloat(delivery.distance).toFixed(2)}
                  <Text style={{color: MEDIUM}}> km</Text>
                </Text>
              </View>
            </View>

            {/*-------------------- DURATION --------------------*/}
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <MCIcon name="timer" size={18} color={'white'} style={styles.iconBox} />
              <View style={{marginLeft: 10}}>
                <Text style={{fontWeight: 'bold'}}>Duration</Text>
                <Text style={{fontWeight: 'bold', color: MEDIUM, fontSize: 11}}>
                  {parseFloat(delivery.duration).toFixed(0)}
                  <Text style={{color: MEDIUM}}> minutes</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginBottom: 20,
  },
  cardShadow: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionIconBox: {
    backgroundColor: DARK,
    height: 30,
    width: 30,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  iconBox: {
    backgroundColor: COLOR,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  iconBoxDark: {
    backgroundColor: DARK,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  directionsBox: {
    height: 50,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  directionDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
});
