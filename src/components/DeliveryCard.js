/**
 * Component used to display a delivery record in my deliveries, orders placed, delivery scheduled and the like
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {COLOR, DARK, MEDIUM, LIGHT, ORANGE, APP_FLAVOR} from '../res/constants';
import {FONT, FONT_SIZE} from '../res/variables';
import {YellowIcon} from '../components/ui';
import {numberFormat} from '../helper/numberFormat';
import moment from 'moment';
import {throttle} from 'lodash';
import 'moment-timezone';

import EIcon from 'react-native-vector-icons/Entypo';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const SchedulePhrase = ({stop}) => {
  const nowDate = moment().format('MMM DD YYYY');
  const tomorrowDate = moment().add(1, 'days').format('MMM DD YYYY');
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
    <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 11, fontFamily: 'Rubik-Medium'}}>
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
          <Text style={{fontFamily: 'Rubik-Medium'}}>{label}</Text>
          {stop.orderType == 1 ? (
            <Text style={{color: MEDIUM, fontSize: 11, fontFamily: 'Rubik-Medium'}}>As Soon As Possible</Text>
          ) : (
            <SchedulePhrase stop={stop} />
          )}
        </View>
      </View>
    </View>
  );
};

const getDisplayAddress = ({stop}) => {
  if (stop.addressBreakdown) {
    const {city, province} = stop.addressBreakdown;
    if (province) {
      return `${city}, ${province}`;
    } else {
      return city;
    }
  } else {
    return stop.formattedAddress;
  }
};

export const DeliveryCard = ({delivery, onPress, lastItem = false}) => {
  const {senderStop, recipientStop, createdAt, status} = delivery;
  const legend = ['', 'As Soon As Possible', 'Scheduled'];
  const orderType = senderStop.orderType === 2 || recipientStop.orderType == 2 ? 2 : 1;

  const onPressThrottled = throttle(onPress, 1000, {trailing: false});
  const getDisplayAmount = () => {
    if (APP_FLAVOR === 'D') {
      if (delivery.discount == 0) {
        return `₱ ${parseFloat(delivery.price)}.00`;
      } else {
        return `(${parseFloat(delivery.price)}+${parseFloat(delivery.discount)}) = ₱ ${
          parseFloat(delivery.price) + parseFloat(delivery.discount)
        }.00`;
      }
    }

    if (APP_FLAVOR === 'C') {
      return `₱ ${parseFloat(delivery.price)}.00`;
    }
  };

  return (
    <View style={{paddingHorizontal: 16, paddingTop: 16, marginBottom: lastItem ? 20 : 0}}>
      <TouchableHighlight onPress={onPressThrottled} underlayColor={COLOR} style={styles.card}>
        <View style={styles.taskBox}>
          {/*-------------------- RIDER EXPRESS DELIVERY --------------------*/}
          {APP_FLAVOR === 'D' && (delivery.expressFee > 0 || delivery.discount !== 0) && (
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.driverCodBox, {flex: 1}]}>
                {delivery.discount !== 0 && (
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicon name="md-pricetag" size={22} color={COLOR} style={styles.iconBoxWhite} />

                    <View style={{marginLeft: 10}}>
                      <Text style={{fontFamily: FONT.BOLD}}>Promo Delivery</Text>
                      <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                        <Text style={{fontFamily: FONT.BOLD, marginLeft: 10}}>{getDisplayAmount()}</Text>
                      </Text>
                    </View>
                  </View>
                )}
                {delivery.expressFee > 0 && (
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <MCIcon name="clock-fast" size={20} color={COLOR} style={styles.iconBoxWhite} />

                    <View style={{marginLeft: 10}}>
                      <Text style={{fontFamily: FONT.BOLD}}>Express Delivery</Text>
                      <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                        <Text style={{fontFamily: FONT.BOLD, marginLeft: 10}}>{`(${
                          delivery.price - delivery.expressFee
                        }+${delivery.expressFee}) = ₱ ${parseFloat(delivery.price)}.00`}</Text>
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/*-------------------- LOOKING FOR YOUR RIDER, KA-TOKTOK --------------------*/}
          {APP_FLAVOR === 'C' && status == 1 && (
            <View style={[styles.directionsBox, {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
              <View style={styles.directionDetail}>
                <YellowIcon set="FontAwesome" name="search" />
                <Text style={{fontSize: 14, marginLeft: 10, color: DARK, fontFamily: FONT.BOLD}}>
                  Looking for your rider,<Text style={{color: ORANGE}}> ka-toktok</Text>
                </Text>
              </View>
            </View>
          )}

          {/*-------------------- PROMO DELIVERY --------------------*/}
          {/* {APP_FLAVOR === 'D' && delivery.discount !== 0 && (
            <View style={styles.driverCodBox}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <Ionicon name="md-pricetag" size={22} color={COLOR} style={styles.iconBoxWhite} />

                <View style={{marginLeft: 10}}>
                  <Text style={{fontFamily: 'Rubik-Medium'}}>Promo Delivery</Text>
                  <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                    <Text style={{fontFamily: 'Rubik-Medium', marginLeft: 10}}>{getDisplayAmount()}</Text>
                  </Text>
                </View>
              </View>
            </View>
          )} */}

          {/*-------------------- RIDER COLLECT PAYMENT FROM SENDER/RECIPIENT AMOUNT --------------------*/}
          {APP_FLAVOR === 'D' && (
            <View style={[styles.directionsBox, {borderBottomWidth: 0, borderColor: LIGHT, borderTopWidth: 0}]}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <YellowIcon set="FontAwesome5" name="hand-holding" />
                <View style={{marginLeft: 10}}>
                  <Text style={{fontFamily: FONT.BOLD}}>
                    Collect From {delivery.collectPaymentFrom === 'S' ? 'Sender' : 'Recipient'}
                  </Text>
                  <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                    <Text style={{fontFamily: FONT.BOLD, marginLeft: 10}}>₱ {delivery.price}.00</Text>
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/*-------------------- CUSTOMER AMOUNT AND DISCOUNT --------------------*/}
          {APP_FLAVOR === 'C' && (
            <View
              style={[
                styles.directionsBox,
                {borderBottomWidth: 0, borderColor: LIGHT, borderTopWidth: StyleSheet.hairlineWidth},
              ]}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <YellowIcon set="Ionicon" name="ios-pricetag" size={18} />
                <View style={{marginLeft: 10}}>
                  <Text style={{fontFamily: FONT.BOLD}}>Amount</Text>
                  <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                    <Text style={{marginLeft: 10, color: MEDIUM}}>₱ {delivery.price}.00</Text>
                  </Text>
                </View>
              </View>
              {delivery.discount !== 0 && (
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <YellowIcon set="Ionicon" name="ios-pricetags" size={18} />
                  <View style={{marginLeft: 10}}>
                    <Text style={{fontFamily: FONT.BOLD}}>Discount</Text>
                    <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                      <Text style={{marginLeft: 10}}>₱ {delivery.discount}.00</Text>
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/*-------------------- RIDER COLLECT PAYMENT FROM WALLET --------------------*/}
          {APP_FLAVOR === 'D' && delivery.discount != 0 && delivery.isDiscountPayable == 1 && (
            <View
              style={[
                styles.directionsBox,
                {borderBottomWidth: 0, borderColor: LIGHT, borderTopWidth: StyleSheet.hairlineWidth},
              ]}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <YellowIcon set="FontAwesome5" name="wallet" />
                <View style={{marginLeft: 10}}>
                  <Text style={{fontFamily: FONT.BOLD}}>Collect From Toktok Wallet</Text>
                  <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                    <Text style={{marginLeft: 10}}>₱ {delivery.discount}.00</Text>
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/*-------------------- CUSTOMER ORDER PRICE --------------------*/}
          {/* {APP_FLAVOR === 'C' && (
            <View style={[styles.directionsBox, {borderBottomWidth: 0, borderColor: LIGHT, borderTopWidth: 0}]}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <YellowIcon set="Ionicon" name="md-pricetag" />
                <View style={{marginLeft: 10}}>
                  <Text style={{fontFamily: 'Rubik-Medium'}}>Amount</Text>
                  <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                    <Text style={{fontFamily: 'Rubik-Medium', marginLeft: 10}}>₱ {delivery.price}.00</Text>
                  </Text>
                </View>
              </View>
            </View>
          )} */}

          {/*-------------------- CASH ON DELIVERY--------------------*/}
          {![null, 0, '0'].includes(delivery.cashOnDelivery) && APP_FLAVOR == 'C' && (
            <View style={[styles.directionsBox, {borderBottomWidth: 0, borderColor: LIGHT}]}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <YellowIcon set="MaterialCommunity" name="cash" size={22} />
                <View style={{marginLeft: 10}}>
                  <Text style={{fontFamily: FONT.BOLD}}>Cash On Delivery</Text>
                  <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                    <Text style={{marginLeft: 10}}>₱ {numberFormat(delivery.cashOnDelivery)}</Text>
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
                  <Text style={{fontFamily: FONT.BOLD}}>Order Date</Text>
                  <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                    {createdAt}
                  </Text>
                </View>
              </View>

              {/*-------------------- ORDER TYPE --------------------*/}
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <YellowIcon set="Fontisto" name="sitemap" />
                <View style={{marginLeft: 10}}>
                  <Text style={{fontFamily: FONT.BOLD}}>Order Type</Text>
                  <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
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
                <Text style={{fontFamily: FONT.BOLD}}>
                  {APP_FLAVOR === 'D' && delivery.status === 1 && delivery.tokDriverId === null
                    ? getDisplayAddress({stop: delivery.senderStop})
                    : delivery.senderStop.name}
                </Text>
                <Text numberOfLines={1} style={{color: MEDIUM, fontSize: 11}}>
                  {APP_FLAVOR === 'D' && delivery.status === 1 && delivery.tokDriverId === null
                    ? delivery.senderStop.name
                    : delivery.senderStop.formattedAddress}
                </Text>
              </View>
              <View style={{borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: LIGHT}} />

              {/*-------------------- RECIPIENT DETAILS --------------------*/}
              <View style={{height: 50, justifyContent: 'center'}}>
                {delivery.recipientStop.name ? (
                  <>
                    <Text style={{fontFamily: FONT.BOLD}}>
                      {APP_FLAVOR === 'D' && delivery.status === 1 && delivery.tokDriverId === null
                        ? getDisplayAddress({stop: delivery.recipientStop})
                        : delivery.recipientStop.name}
                    </Text>
                    <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                      {APP_FLAVOR === 'D' && delivery.status === 1 && delivery.tokDriverId === null
                        ? delivery.recipientStop.name
                        : delivery.recipientStop.formattedAddress}
                    </Text>
                  </>
                ) : (
                  <Text style={{fontFamily: 'Rubik-Medium'}}>Recipient</Text>
                )}
              </View>
            </View>
          </View>

          {/*-------------------- DRIVER INFO --------------------*/}
          {delivery.driver && APP_FLAVOR === 'C' && (
            <View style={[styles.directionsBox, {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
              <View style={styles.directionDetail}>
                <YellowIcon set="Fontisto" name="motorcycle" />
                <View style={{marginLeft: 10}}>
                  <Text style={{fontFamily: FONT.BOLD}}>
                    {`${delivery.driver.user.person.firstName} ${delivery.driver.user.person.lastName}`}
                  </Text>
                  <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                    {delivery.driver.user.username}
                  </Text>
                </View>
              </View>
            </View>
          )}

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
                  <Text style={{fontFamily: FONT.BOLD, fontSize: 14}}>Distance</Text>
                  <Text style={{color: MEDIUM, fontSize: 11}}>
                    {parseFloat(delivery.distance).toFixed(2)}
                    <Text style={{color: MEDIUM, fontSize: 11}}> km</Text>
                  </Text>
                </View>
              </View>

              {/*-------------------- DURATION --------------------*/}
              {/* <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <YellowIcon set="MaterialCommunity" name="timer" size={18} />
                <View style={{marginLeft: 10}}>
                  <Text style={{fontFamily: 'Rubik-Medium'}}>Duration</Text>
                  <Text style={{fontFamily: 'Rubik-Medium', color: MEDIUM, fontSize: 11}}>
                    {parseFloat(delivery.duration).toFixed(0)}
                    <Text style={{color: MEDIUM}}> minutes</Text>
                  </Text>
                </View>
              </View> */}
              {/*-------------------- CREDIT COST --------------------*/}
              {APP_FLAVOR == 'D' && (
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <YellowIcon set="MaterialCommunity" name="credit-card" />
                  <View style={{marginLeft: 10}}>
                    <Text style={{fontFamily: FONT.BOLD}}>Credit Cost</Text>
                    <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                      <Text style={{marginLeft: 10}}>
                        {numberFormat(
                          (parseFloat(delivery.price) + parseFloat(delivery.discount)) * parseFloat(delivery.comRate),
                        )}
                      </Text>
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/*-------------------- RIDER CASH ON DELIVERY --------------------*/}
          {APP_FLAVOR === 'D' && ![null, 0, '0'].includes(delivery.cashOnDelivery) && (
            <View style={styles.bottomYellowRow}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <MCIcon name="cash" size={24} color={COLOR} style={styles.iconBoxWhite} />

                <View style={{marginLeft: 10}}>
                  <Text style={{fontFamily: FONT.BOLD}}>Cash On Delivery</Text>
                  <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                    <Text style={{marginLeft: 10}}>₱ {delivery.cashOnDelivery}.00</Text>
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
    borderRadius: 5,
  },
  taskBox: {
    backgroundColor: 'white',
    borderRadius: 5,
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
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingHorizontal: 20,
  },
  topYellowRow: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingHorizontal: 20,
  },
  bottomYellowRow: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingHorizontal: 20,
  },
});
