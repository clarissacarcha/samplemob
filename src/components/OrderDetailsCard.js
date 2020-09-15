/**
 * Displayed in Selected Delivery Details
 * Used to display Order Date, Order Type and Schedule
 */
import React from 'react';
import {View, Text, StyleSheet, Platform, Linking} from 'react-native';
import {COLOR, DARK, MEDIUM, ORANGE, LIGHT, APP_FLAVOR} from '../res/constants';
import {YellowIcon} from '../components/ui';
import {numberFormat} from '../helper';
import moment from 'moment';

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

export const OrderDetailsCard = ({delivery}) => {
  const {senderStop, recipientStop} = delivery;
  const legend = ['', 'As Soon As Possible', 'Scheduled'];
  const orderType = senderStop.orderType === 2 || recipientStop.orderType == 2 ? 2 : 1;

  const collectFromString = delivery.collectPaymentFrom == 'S' ? 'Sender' : 'Recipient';

  return (
    <View style={styles.card}>
      <View style={styles.cardShadow}>
        {/*------------------- STOP LABEL-------------------*/}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: MEDIUM,
          }}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 20}}>
            <YellowIcon set="FontAwesome5" name="file-alt" size={16} darkIcon />

            <Text style={{marginLeft: 10, color: DARK, fontWeight: 'bold'}}>
              Order <Text style={{color: ORANGE}}>Details</Text>
            </Text>
          </View>

          {APP_FLAVOR == 'D' && (
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <YellowIcon set="MaterialCommunity" name="credit-card" size={16} />

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

        {/*-------------------- EXPRESS DELIVERY ROW --------------------*/}
        {delivery.expressFee != 0 && (
          <View style={[styles.directionsBox, {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <YellowIcon set="MaterialCommunity" name="clock-fast" size={16} />

              <View style={{marginLeft: 10}}>
                <Text style={{fontWeight: 'bold'}}>Express Delivery</Text>
                <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                  <Text style={{fontWeight: 'bold', marginLeft: 10}}>₱ {delivery.expressFee}.00</Text>
                </Text>
              </View>
            </View>
          </View>
        )}

        {/*-------------------- ORDER PRICE AND COD ROW --------------------*/}
        <View style={[styles.directionsBox, {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <YellowIcon set="Ionicon" name="md-pricetag" size={16} />

            <View style={{marginLeft: 10}}>
              <Text style={{fontWeight: 'bold'}}>Amount</Text>
              <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                <Text style={{fontWeight: 'bold', marginLeft: 10}}>
                  ₱ {parseFloat(delivery.price) + parseFloat(delivery.expressFee)}.00
                </Text>
              </Text>
            </View>
          </View>
          {delivery.cashOnDelivery && (
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <YellowIcon set="MaterialCommunity" name="cash" size={22} />

              <View style={{marginLeft: 10}}>
                <Text style={{fontWeight: 'bold'}}>Cash On Delivery</Text>
                <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                  <Text style={{fontWeight: 'bold', marginLeft: 10}}>₱ {delivery.cashOnDelivery}.00</Text>
                </Text>
              </View>
            </View>
          )}
        </View>

        {/*-------------------- ORDER DATE AND TYPE ROW --------------------*/}
        <View
          style={[
            styles.directionsBox,
            {borderBottomWidth: StyleSheet.hairlineWidth, borderColor: LIGHT, paddingVertical: 10},
          ]}>
          <View style={styles.directionDetail}>
            {/*-------------------- ORDER DATE --------------------*/}
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <YellowIcon set="FontAwesome" name="calendar" />
              <View style={{marginLeft: 10}}>
                <Text style={{fontWeight: 'bold', fontSize: 14}}>Order Date</Text>
                <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 10, fontWeight: 'bold'}}>
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
              <YellowIcon set="MaterialCommunity" name="map-marker-distance" size={16} />
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

        {/*-------------------- ITEM DESCRIPTION --------------------*/}
        <View style={[styles.rowFlexibleHeightTop]}>
          <View style={{flex: 1, flexDirection: 'row', marginTop: 8}}>
            <YellowIcon set="Entypo" name="box" size={16} containerStyle={{marginTop: 4}} />
            <View style={{marginLeft: 10}}>
              <Text style={{fontWeight: 'bold'}}>Item Description</Text>
              <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                <Text style={{fontWeight: 'bold', marginLeft: 10}}>{delivery.cargo}</Text>
              </Text>
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row', marginTop: 8}}>
            <YellowIcon set="FontAwesome5" name="hand-holding" size={16} containerStyle={{marginTop: 4}} />
            <View style={{marginLeft: 10}}>
              <Text style={{fontWeight: 'bold'}}>Collect From</Text>
              <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                <Text style={{fontWeight: 'bold', marginLeft: 10}}>{collectFromString}</Text>
              </Text>
            </View>
          </View>
        </View>
        {/*-------------------- DELIVERY NOTES --------------------*/}
        {delivery.notes && (
          <View style={[styles.rowFlexibleHeight, {borderTopWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
            <View style={{flex: 1, flexDirection: 'row', marginTop: 8}}>
              <YellowIcon set="SimpleLine" name="note" size={14} containerStyle={{marginTop: 4}} />
              <View style={{marginLeft: 10}}>
                <Text style={{fontWeight: 'bold'}}>Notes</Text>
                <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                  <Text style={{fontWeight: 'bold', marginLeft: 10}}>{delivery.notes}</Text>
                </Text>
              </View>
            </View>
          </View>
        )}
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
  rowFlexibleHeight: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  rowFlexibleHeightTop: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
});
