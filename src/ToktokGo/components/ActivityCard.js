/**
 * Component used to display a delivery record in my deliveries, orders placed, delivery scheduled and the like
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight, Image} from 'react-native';
import {DARK, MEDIUM, LIGHT, ORANGE, APP_FLAVOR, FONT_COLOR} from '../../res/constants';
import {constant, throttle} from 'lodash';
import 'moment-timezone';

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

const getDisplayAddress = ({stop}) => {
  if (stop.addressBreakdown) {
    const {city, province} = stop.addressBreakdown;
    const {formattedAddress} = stop;
    if (province) {
      return (
        <View>
          <Text>
            {city}, {province}
          </Text>
          <Text style={{fontSize: 11, color: '#525252'}}>{formattedAddress}</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text>{city}</Text>
          <Text style={{fontSize: 11, color: '#525252'}}>{formattedAddress}</Text>
        </View>
      );
    }
  } else {
    return stop.formattedAddress;
  }
};

export const ActivitiesCard = ({delivery, onPress, lastItem = false}) => {
  const onPressThrottled = throttle(onPress, 1000, {trailing: false});

  const getTotalAmount = () => {
    return `₱${parseFloat(delivery.price)}.00`;
  };

  const getTextStatus = () => {
    //to do: replace returned text based on status
    if ([1, 2, 3, 4, 5].includes(delivery.status)) return 'Passenger picked up';
    else if (delivery.status == 6) return 'Completed';
    else if (delivery.status == 7) return 'Cancelled';
  };

  const getIconStatus = () => {
    if (delivery.status == 1) return OnGoingIcon;
    else if (delivery.status == 6) return CompletedIcon;
    else if (delivery.status == 7) return CancelledIcon;
  };

  // const blackFont = status === 7 ? constants.COLOR.DARK : constants.COLOR.BLACK;
  const conditionalFontFamily = [2, 3, 4, 5].includes(delivery.status)
    ? constants.FONT_FAMILY.BOLD
    : constants.COLOR.BLACK;

  return (
    <View style={{paddingHorizontal: 16, paddingTop: 16, marginBottom: lastItem ? 20 : 0}}>
      <TouchableHighlight onPress={onPressThrottled} underlayColor={constants.COLOR.YELLOW} style={styles.card}>
        <View style={styles.taskBox}>
          {/*-------------------- CARD HEADER --------------------*/}
          {/* {APP_FLAVOR === 'D' && ( */}
          {true && (
            <View style={styles.headerWhite}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{width: 150}}>
                  <Text style={{fontSize: constants.FONT_SIZE.M}}>
                    Booking ID
                    <Text
                      style={{
                        color: constants.COLOR.YELLOW,
                        fontSize: constants.FONT_SIZE.M,
                        fontFamily: constants.FONT_FAMILY.BOLD,
                      }}>
                      {' '}
                      FLKHD{delivery.id}
                    </Text>
                  </Text>
                  <Text style={{fontSize: constants.FONT_SIZE.S, color: constants.COLOR.ALMOST_BLACK}}>
                    Jan 7, 2022 10:00 AM
                  </Text>
                </View>

                <View
                  style={{
                    marginLeft: 10,
                    justifyContent: 'flex-end',
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image source={getIconStatus()} style={{height: 14, width: 16}} resizeMode={'contain'} />
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
          )}

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
                      {/* <Text style={{ fontFamily: conditionalFontFamily, fontSize: constants.FONT_SIZE.S, color: blackFont, marginTop: 2 }}> */}
                      {getDisplayAddress({stop: delivery.senderStop})}
                      {/* </Text> */}
                    </View>

                    {/*-------------------- RECIPIENT DETAILS --------------------*/}
                    <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 3}}>
                      {delivery.recipientStop.name && (
                        <>
                          {/* <Text style={{ fontFamily: conditionalFontFamily, fontSize: constants.FONT_SIZE.S, color: blackFont }}> */}
                          {getDisplayAddress({stop: delivery.recipientStop})}
                          {/* </Text> */}
                        </>
                      )}
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
                <Image source={Wallet} style={{width: 22, height: 18, marginRight: 10}} />
                <Image source={ToktokWalletText} resizeMode={'contain'} style={{width: '25%', height: 16}} />
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                  <Text
                    style={{
                      paddingLeft: 10,
                      color: constants.COLOR.ORANGE,
                      fontSize: constants.FONT_SIZE.M,
                      fontFamily: constants.FONT_FAMILY.BOLD,
                    }}>
                    Total
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
