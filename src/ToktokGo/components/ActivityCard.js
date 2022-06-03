/**
 * Component used to display a delivery record in my deliveries, orders placed, delivery scheduled and the like
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight, Image} from 'react-native';
import {DARK, MEDIUM, LIGHT, ORANGE, APP_FLAVOR, FONT_COLOR} from '../../res/constants';
import {constant, throttle} from 'lodash';
import 'moment-timezone';
import moment from 'moment';

import EIcon from 'react-native-vector-icons/Entypo';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import constants from '../../common/res/constants';
import Wallet from '../../assets/images/Wallet.png';
import OnGoingIcon from '../../assets/icons/OnGoing.png';
import CompletedIcon from '../../assets/icons/Completed.png';
import CancelledIcon from '../../assets/icons/Cancelled.png';
import ToktokWalletText from '../../assets/images/ToktokwalletText.png';
import DestinationIcon from '../../assets/icons/DestinationIcon.png';
import OriginIcon from '../../assets/icons/OriginIcon.png';
import CashIcon from '../../assets/images/CashIcon.png';
import Constants from '../../store/redux/reducers/Constants';
import {numberFormat} from '../../helper';

const getDisplayAddress = ({stop}) => {
  console.log(stop);
  if (stop?.addressBreakdown) {
    const {city, province} = stop.addressBreakdown;
    const {formattedAddress} = stop;
    if (province) {
      return (
        <View style={{width: 320}}>
          <Text>
            {city}, {province}
          </Text>
          <Text style={{fontSize: 11, color: '#525252'}}>{formattedAddress}</Text>
        </View>
      );
    } else {
      return (
        <View style={{width: 320}}>
          <Text>{city}</Text>
          <Text style={{fontSize: 11, color: '#525252'}}>{formattedAddress}</Text>
        </View>
      );
    }
  } else {
    return stop?.formattedAddress;
  }
};

export const ActivitiesCard = ({booking, onPress, lastItem = false}) => {
  const onPressThrottled = throttle(onPress, 1000, {trailing: false});

  const getTotalAmount = () => {
    return `₱${numberFormat(booking?.fare?.total)}`;
  };
  const headerDesign = () => {
    let design = styles.headerYellow;
    if (['ONGOING', 'COMPLETED'].includes(booking?.tag)) {
      design = styles.headerWhite;
    }
    if (booking?.tag == 'CANCELLED') {
      design = styles.headerGrey;
    }
    return design;
  };

  const getTextStatus = () => {
    if (booking?.tag == 'ONGOING') {
      switch (booking.status) {
        case 'ACCEPTED':
          return 'Driver accepted';
        case 'ARRIVED':
          return 'Driver arrived at Pick-up location';
        case 'PICKED_UP':
          return 'Passenger picked up';
        default:
          return '';
      }
    } else if (booking?.tag == 'COMPLETED') return 'Completed';
    else if (booking?.tag == 'CANCELLED') return 'Cancelled';
  };

  const getIconStatus = () => {
    if (booking?.tag == 'ONGOING') return OnGoingIcon;
    else if (booking?.tag == 'COMPLETED') return CompletedIcon;
    else if (booking?.tag == 'CANCELLED') return CancelledIcon;
  };

  const blackFont = booking?.tag == 'CANCELLED' ? constants.COLOR.DARK : constants.COLOR.BLACK;
  const conditionalFontFamily = booking?.tag == 'ONGOING' ? constants.FONT_FAMILY.BOLD : constants.COLOR.BLACK;

  return (
    <View style={{paddingHorizontal: 16, paddingTop: 16, marginBottom: lastItem ? 20 : 0}}>
      <TouchableHighlight onPress={onPressThrottled} underlayColor={constants.COLOR.YELLOW} style={styles.card}>
        <View style={styles.taskBox}>
          {/*-------------------- CARD HEADER --------------------*/}
          {/* {APP_FLAVOR === 'D' && ( */}
          {
            <View style={styles.headerWhite}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: constants.FONT_SIZE.M}}>
                    Booking ID
                    <Text
                      style={{
                        color: constants.COLOR.YELLOW,
                        fontSize: constants.FONT_SIZE.M,
                        fontFamily: constants.FONT_FAMILY.BOLD,
                      }}>
                      {' '}
                      {booking?.id}
                    </Text>
                  </Text>
                  <Text style={{fontSize: constants.FONT_SIZE.S, color: constants.COLOR.ALMOST_BLACK}}>
                    {moment(booking?.logs[0].createdAt).format('MMM D, YYYY hh:mm A')}
                  </Text>
                </View>

                <View
                  style={{
                    marginLeft: 10,
                    justifyContent: 'flex-end',
                    flex: 0.8,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={getIconStatus()}
                    style={booking?.tag == 'ONGOING' ? {height: 16, width: 18} : {height: 14, width: 16}}
                    resizeMode={'contain'}
                  />
                  <Text
                    style={{
                      fontFamily: constants.FONT_FAMILY.REGULAR,
                      fontSize: constants.FONT_SIZE.M,
                      color: constants.COLOR.BLACK,
                      paddingLeft: 10,
                      fontWeight: '400',
                    }}>
                    {getTextStatus()}
                  </Text>
                </View>
              </View>
            </View>
          }

          {/*-------------------- SENDER RECIPIENT ADDRESS ROW --------------------*/}
          <View style={[styles.directionsBox, {marginTop: 5}]}>
            <View style={styles.directionDetail}>
              {/*-------------------- ORDER DATE --------------------*/}
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                }}>
                <View style={{flexDirection: 'row', paddingVertical: 10}}>
                  {/*-------------------- ICONS --------------------*/}
                  <View style={{justifyContent: 'center', paddingRight: 8, paddingBottom: 10}}>
                    <Image
                      source={OriginIcon}
                      resizeMode={'contain'}
                      style={{width: 15, height: 15, marginLeft: -1, marginBottom: 5}}
                    />
                    <View style={{overflow: 'hidden'}}>
                      <EIcon
                        name="dots-three-vertical"
                        size={11}
                        color={constants.COLOR.MEDIUM}
                        style={{marginLeft: 1}}
                      />
                      <EIcon
                        name="dots-three-vertical"
                        size={11}
                        color={constants.COLOR.MEDIUM}
                        style={{marginLeft: 1}}
                      />
                    </View>
                    <Image
                      source={DestinationIcon}
                      resizeMode={'contain'}
                      style={{width: 15, height: 15, marginTop: 5}}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    {/*-------------------- SENDER DETAILS --------------------*/}
                    <View
                      style={{
                        flex: 1,
                        marginBottom: 5,
                      }}>
                      <Text
                        style={{
                          fontFamily: conditionalFontFamily,
                          fontSize: constants.FONT_SIZE.S,
                          color: blackFont,
                          marginTop: 2,
                        }}>
                        {getDisplayAddress({stop: booking?.route?.origin})}
                      </Text>
                    </View>

                    {/*-------------------- RECIPIENT DETAILS --------------------*/}
                    <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 3}}>
                      <Text
                        style={{
                          fontFamily: conditionalFontFamily,
                          fontSize: constants.FONT_SIZE.S,
                          color: blackFont,
                          marginTop: 2,
                        }}>
                        {getDisplayAddress({stop: booking?.route?.destinations[0]})}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{paddingHorizontal: 20}}>
            <View style={{borderBottomWidth: 2, borderBottomColor: '#F7F7FA', width: '100%'}} />
            <View style={{paddingVertical: 20}}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                {booking.paymentMethod == 'CASH' ? (
                  <>
                    <Image source={CashIcon} resizeMode="contain" style={{width: 30, height: 16, marginRight: 8}} />
                    <Text
                      style={{
                        fontFamily: constants.FONT_FAMILY.REGULAR,
                        color: constants.COLOR.YELLOW,
                        fontSize: constants.FONT_SIZE.M,
                      }}>
                      Cash
                    </Text>
                  </>
                ) : (
                  <>
                    <Image source={Wallet} style={{width: 22, height: 18, marginRight: 10}} />
                    <Image source={ToktokWalletText} resizeMode={'contain'} style={{width: '25%', height: 16}} />
                  </>
                )}
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                  <Text
                    style={{
                      paddingLeft: 10,
                      color: constants.COLOR.ORANGE,
                      fontSize: constants.FONT_SIZE.M,
                      fontFamily: constants.FONT_FAMILY.BOLD,
                    }}>
                    {booking.tag == 'ONGOING' ? 'Total:' : 'Total Paid:'}
                  </Text>
                  <Text
                    style={{
                      fontFamily: constants.FONT_FAMILY.BOLD,
                      paddingLeft: 10,
                      fontSize: constants.FONT_SIZE.M,
                      color: constants.COLOR.ORANGE,
                    }}>
                    {getTotalAmount()}
                  </Text>
                </View>
              </View>
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
    backgroundColor: constants.COLOR.YELLOW,
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
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  directionDetail: {
    flex: 1,
    flexDirection: 'row',
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
    backgroundColor: constants.COLOR.YELLOW,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingHorizontal: 20,
  },
  topYellowRow: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: constants.COLOR.YELLOW,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingHorizontal: 20,
  },
  bottomYellowRow: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: constants.COLOR.ORANGE,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingHorizontal: 10,
  },
  headerYellow: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    backgroundColor: constants.COLOR.LIGHT_YELLOW,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  headerWhite: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    backgroundColor: '#FFFCF4',
    borderWidth: 1,
    borderColor: constants.COLOR.WHITE,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  headerGrey: {
    height: 50,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    backgroundColor: constants.COLOR.WHITE,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#ED3A19',
  },
});
