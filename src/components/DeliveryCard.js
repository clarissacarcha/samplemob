/**
 * Component used to display a delivery record in my deliveries, orders placed, delivery scheduled and the like
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {COLOR, DARK, MEDIUM, LIGHT, ORANGE, APP_FLAVOR} from '../res/constants';
import moment from 'moment';
import 'moment-timezone';

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
  const stopDate = moment(stop.scheduledFrom, 'MM/DD/YYYY - hh:mm A').format('MMM D YYYY');

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

export const DeliveryCard = ({delivery, onPress, lastItem = false}) => {
  const {senderStop, recipientStop} = delivery;
  const legend = ['', 'As Soon As Possible', 'Scheduled'];
  const orderType = senderStop.orderType === 2 || recipientStop.orderType == 2 ? 2 : 1;

  return (
    <View style={{paddingHorizontal: 20, paddingTop: 20, marginBottom: lastItem ? 20 : 0}}>
      <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={styles.card}>
        <View style={styles.taskBox}>
          {/*-------------------- LOOKING FOR YOUR RIDER, KA-TOKTOK --------------------*/}
          {APP_FLAVOR == 'C' && (
            <View style={[styles.directionsBox, {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
              <View style={styles.directionDetail}>
                <FAIcon name="search" size={14} color={'white'} style={styles.iconBox} />
                <Text style={{fontSize: 14, marginLeft: 16, color: DARK, fontWeight: 'bold'}}>
                  Looking for your rider,<Text style={{color: ORANGE}}> ka-toktok</Text>
                </Text>
              </View>
            </View>
          )}

          <View style={[styles.directionsBox, {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
            <View style={styles.directionDetail}>
              {/*-------------------- ORDER DATE --------------------*/}
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <FAIcon name="calendar" size={14} color={'white'} style={styles.iconBox} />
                <View style={{marginLeft: 16}}>
                  <Text style={{fontWeight: 'bold', fontSize: 14}}>Order Date</Text>
                  <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 11, fontWeight: 'bold'}}>
                    {delivery.createdAt}
                  </Text>
                </View>
              </View>

              {/*-------------------- ORDER TYPE --------------------*/}
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <Fontisto name="sitemap" size={14} color={'white'} style={styles.iconBox} />
                <View style={{marginLeft: 16}}>
                  <Text style={{fontWeight: 'bold'}}>Order Type</Text>
                  <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 11, fontWeight: 'bold'}}>
                    {legend[orderType]}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {orderType == 2 && (
            <>
              {/*-------------------- PICK UP --------------------*/}
              <DeliverySchedule label="Pick Up" stop={senderStop} />

              {/*-------------------- DELIVER --------------------*/}
              <DeliverySchedule label="Deliver" stop={recipientStop} />
            </>
          )}

          {/*-------------------- PICK UP --------------------*/}
          {/* <View style={[styles.directionsBox, {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <EIcon name="hand" size={14} color={'white'} style={styles.iconBox} />
              <View style={{marginLeft: 16}}>
                <Text style={{fontWeight: 'bold'}}>Pick Up</Text>
                <SchedulePhrase stop={senderStop} />
              </View>
            </View>
          </View> */}

          {/*-------------------- DELIVER --------------------*/}
          {/* <View style={[styles.directionsBox, {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <FA5Icon name="hands-helping" size={14} color={'white'} style={styles.iconBox} />
              <View style={{marginLeft: 16}}>
                <Text style={{fontWeight: 'bold'}}>Deliver</Text>
                <SchedulePhrase stop={recipientStop} />
              </View>
            </View>
          </View> */}

          {/*-------------------- DATE CREATED --------------------*/}
          {/* <View style={[styles.directionsBox, {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
            <View style={styles.directionDetail}>
              <FAIcon name="calendar" size={14} color={'white'} style={styles.iconBox} />

              <Text style={{fontSize: 12, marginLeft: 16, color: MEDIUM, fontWeight: 'bold'}}>
                {moment
                  .tz(delivery.createdAt, 'Asia/Manila')
                  .format('MM/DD/YYYY - hh:mm A')
                  .toString()}
              </Text>
            </View>
          </View> */}
          <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            {/*-------------------- ICONS --------------------*/}
            <View style={{width: 40, justifyContent: 'center'}}>
              <FA5Icon name="map-pin" size={16} color={DARK} style={styles.iconBox} />
              <EIcon name="flow-line" size={26} color={DARK} />
              <FA5Icon name="map-marker-alt" size={16} color={DARK} style={styles.iconBox} />
            </View>
            <View style={{flex: 1}}>
              {/*-------------------- SENDER DETAILS --------------------*/}
              <View
                style={{
                  height: 50,
                  justifyContent: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>{delivery.senderStop.name}</Text>
                <Text numberOfLines={1} style={{color: MEDIUM, fontSize: 10}}>
                  {delivery.senderStop.formattedAddress}
                </Text>
              </View>
              <View style={{borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: LIGHT}} />

              {/*-------------------- RECIPIENT DETAILS --------------------*/}
              <View style={{height: 50, justifyContent: 'center'}}>
                {delivery.recipientStop.name ? (
                  <>
                    <Text style={{fontWeight: 'bold'}}>{delivery.recipientStop.name}</Text>
                    <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 10}}>
                      {delivery.recipientStop.formattedAddress}
                    </Text>
                  </>
                ) : (
                  <Text style={{fontWeight: 'bold'}}>Recipient</Text>
                )}
              </View>
            </View>
          </View>

          {/*-------------------- DRIVER INFO --------------------*/}
          {delivery.driver && APP_FLAVOR == 'C' && (
            <View style={[styles.directionsBox, {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
              <View style={styles.directionDetail}>
                <Fontisto name="motorcycle" size={18} color={DARK} style={styles.iconBox} />
                <View style={{marginLeft: 16}}>
                  <Text style={{fontWeight: 'bold'}}>
                    {`${delivery.driver.user.person.firstName} ${delivery.driver.user.person.lastName}`}
                  </Text>
                  <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 10}}>
                    {`+63${delivery.driver.user.username}`}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/*---------------------------------------- ROUTE DETAILS ----------------------------------------*/}
          <View style={styles.directionsBox}>
            {/*-------------------- DISTANCE --------------------*/}
            <View style={styles.directionDetail}>
              <MCIcon name="map-marker-distance" size={16} color={'white'} style={styles.iconBox} />
              <Text style={{fontWeight: 'bold', marginLeft: 16}}>
                {parseFloat(delivery.distance).toFixed(2)}
                <Text style={{color: MEDIUM}}> km</Text>
              </Text>
            </View>
            {/*-------------------- DURATION --------------------*/}
            <View style={styles.directionDetail}>
              <MCIcon name="timer" size={18} color={'white'} style={styles.iconBox} />

              <Text style={{fontWeight: 'bold', marginLeft: 16}}>
                {parseFloat(delivery.duration).toFixed(0)}
                <Text style={{color: MEDIUM}}> min</Text>
              </Text>
            </View>
            {/*-------------------- PRICE --------------------*/}
            <View style={styles.directionDetail}>
              <Ionicon name="md-pricetag" size={16} color={'white'} style={styles.iconBox} />
              <Text style={{fontWeight: 'bold', marginLeft: 16}}>₱{delivery.price}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  pad: {
    padding: 10,
  },
  card: {
    borderRadius: 10,
  },
  taskBox: {
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
    borderTopColor: LIGHT,
    alignItems: 'center',
  },
  directionDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
