/**
 * Component used to display a delivery record in my deliveries, orders placed, delivery scheduled and the like
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {COLOR, DARK, MEDIUM, LIGHT, ORANGE, APP_FLAVOR} from '../res/constants';
import {YellowIcon} from '../components/ui';
import {numberFormat} from '../helper/numberFormat';
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
          <YellowIcon set="Entypo" name="hand" />
        ) : (
          <YellowIcon set="FontAwesome5" name="hands-helping" size={14} />
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
  const {senderStop, recipientStop, createdAt, status} = delivery;
  const legend = ['', 'As Soon As Possible', 'Scheduled'];
  const orderType = senderStop.orderType === 2 || recipientStop.orderType == 2 ? 2 : 1;

  return (
    <View style={{paddingHorizontal: 20, paddingTop: 20, marginBottom: lastItem ? 20 : 0}}>
      <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={styles.card}>
        <View style={styles.taskBox}>
          {/*-------------------- RIDER EXPRESS DELIVERY --------------------*/}
          {APP_FLAVOR == 'D' && delivery.expressFee > 0 && (
            <View style={styles.driverCodBox}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <MCIcon name="clock-fast" size={20} color={COLOR} style={styles.iconBoxWhite} />

                <View style={{marginLeft: 10}}>
                  <Text style={{fontWeight: 'bold'}}>Express Delivery</Text>
                  <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                    <Text style={{fontWeight: 'bold', marginLeft: 10}}>₱ {delivery.expressFee}.00</Text>
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/*-------------------- LOOKING FOR YOUR RIDER, KA-TOKTOK --------------------*/}
          {APP_FLAVOR == 'C' && status == 1 && (
            <View style={[styles.directionsBox, {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
              <View style={styles.directionDetail}>
                <YellowIcon set="FontAwesome" name="search" />
                <Text style={{fontSize: 14, marginLeft: 10, color: DARK, fontWeight: 'bold'}}>
                  Looking for your rider,<Text style={{color: ORANGE}}> ka-toktok</Text>
                </Text>
              </View>
            </View>
          )}

          {/*-------------------- ORDER PRICE AND CREDIT COST --------------------*/}
          <View style={[styles.directionsBox, {borderBottomWidth: 0, borderColor: LIGHT, borderTopWidth: 0}]}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <YellowIcon set="Ionicon" name="md-pricetag" />
              <View style={{marginLeft: 10}}>
                <Text style={{fontWeight: 'bold'}}>Amount</Text>
                <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                  <Text style={{fontWeight: 'bold', marginLeft: 10}}>
                    ₱ {parseFloat(delivery.price) + parseFloat(delivery.expressFee)}.00
                  </Text>
                </Text>
              </View>
            </View>
            {APP_FLAVOR == 'D' && (
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <YellowIcon set="MaterialCommunity" name="credit-card" />
                <View style={{marginLeft: 10}}>
                  <Text style={{fontWeight: 'bold'}}>Credit Cost</Text>
                  <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                    <Text style={{fontWeight: 'bold', marginLeft: 10}}>
                      {numberFormat((parseFloat(delivery.price) + parseFloat(delivery.expressFee)) * delivery.comRate)}
                    </Text>
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/*-------------------- CASH ON DELIVERY--------------------*/}
          {delivery.cashOnDelivery && APP_FLAVOR == 'C' && (
            <View style={[styles.directionsBox, {borderBottomWidth: 0, borderColor: LIGHT}]}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <YellowIcon set="MaterialCommunity" name="cash" size={22} />
                <View style={{marginLeft: 10}}>
                  <Text style={{fontWeight: 'bold'}}>Cash On Delivery</Text>
                  <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                    <Text style={{fontWeight: 'bold', marginLeft: 10}}>₱ {numberFormat(delivery.cashOnDelivery)}</Text>
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/*-------------------- SENDER RECIPIENT ADDRESS ROW --------------------*/}
          <View style={[styles.directionsBox, {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
            <View style={styles.directionDetail}>
              {/*-------------------- ORDER DATE --------------------*/}
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <YellowIcon set="FontAwesome" name="calendar" />
                <View style={{marginLeft: 10}}>
                  <Text style={{fontWeight: 'bold', fontSize: 14}}>Order Date</Text>
                  <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 10, fontWeight: 'bold'}}>
                    {createdAt}
                  </Text>
                </View>
              </View>

              {/*-------------------- ORDER TYPE --------------------*/}
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <YellowIcon set="Fontisto" name="sitemap" />
                <View style={{marginLeft: 10}}>
                  <Text style={{fontWeight: 'bold'}}>Order Type</Text>
                  <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 10, fontWeight: 'bold'}}>
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

          <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            {/*-------------------- ICONS --------------------*/}
            <View style={{width: 34, justifyContent: 'center'}}>
              <YellowIcon set="FontAwesome5" name="map-pin" darkIcon />
              <EIcon name="flow-line" size={26} color={DARK} style={{right: 1}} />
              <YellowIcon set="FontAwesome5" name="map-marker-alt" darkIcon />
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
          {delivery.driver &&
            (APP_FLAVOR == 'C' && (
              <View style={[styles.directionsBox, {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
                <View style={styles.directionDetail}>
                  <YellowIcon set="Fontisto" name="motorcycle" />
                  <View style={{marginLeft: 10}}>
                    <Text style={{fontWeight: 'bold'}}>
                      {`${delivery.driver.user.person.firstName} ${delivery.driver.user.person.lastName}`}
                    </Text>
                    <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 10}}>
                      {delivery.driver.user.username}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

          {/*---------------------------------------- DISTANCE DURATION ROW ----------------------------------------*/}
          <View
            style={[
              styles.directionsBox,
              {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT, paddingVertical: 10},
            ]}>
            <View style={styles.directionDetail}>
              {/*-------------------- DISTANCE --------------------*/}
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <YellowIcon set="MaterialCommunity" name="map-marker-distance" />
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
                <YellowIcon set="MaterialCommunity" name="timer" size={18} />
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

          {/*-------------------- RIDER CASH ON DELIVERY --------------------*/}
          {APP_FLAVOR == 'D' && delivery.cashOnDelivery && (
            <View style={styles.bottomYellowRow}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <MCIcon name="cash" size={24} color={COLOR} style={styles.iconBoxWhite} />

                <View style={{marginLeft: 10}}>
                  <Text style={{fontWeight: 'bold'}}>Cash On Delivery</Text>
                  <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                    <Text style={{fontWeight: 'bold', marginLeft: 10}}>₱ {delivery.cashOnDelivery}.00</Text>
                  </Text>
                </View>
              </View>
            </View>
          )}
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
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  directionDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBoxWhite: {
    backgroundColor: 'white',
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    overflow: 'hidden',
  },

  driverCodBox: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 20,
  },
  topYellowRow: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 20,
  },
  bottomYellowRow: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 20,
  },
});
