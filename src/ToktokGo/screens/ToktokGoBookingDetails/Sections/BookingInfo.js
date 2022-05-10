import React from 'react';
import {Text, StyleSheet, Image, View} from 'react-native';
import constants from '../../../../common/res/constants';
import {APP_FLAVOR, MEDIUM} from '../../../../res/constants';
import {FONT} from '../../../../res/variables';

import MapIcon from '../../../../assets/images/mapIcon.png';
import ClockIcon from '../../../../assets/images/clockIcon.png';
import PassengerIcon from '../../../../assets/images/Passenger.png';
import ToktokWalletOutline from '../../../../assets/images/toktok-wallet-outline.png';
import CashIcon from '../../../../assets/images/CashIcon.png';

import moment from 'moment';

export const BookingInfo = ({booking}) => {
  const minDuration = booking.route.duration.minute;
  const [createdAtTime, setCreatedAtTime] = useState(booking?.logs[0]?.createdAt);
  const maxTime = moment(createdAtTime).add(minDuration, 'minutes').format('hh:mm A');
  const minTime = moment(createdAtTime).format('hh:mm A');

  return (
    <View style={styles.card}>
      <View style={styles.directionsBox}>
        <View style={styles.directionDetail}>
          {/*-------------------- ORDER DATE --------------------*/}
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              {/*-------------------- CREDIT COST --------------------*/}

              <View style={{flex: 1}}>
                <Text style={{fontFamily: FONT.BOLD, fontSize: constants.FONT_SIZE.M}}>Booking Information</Text>
                <Text style={{fontFamily: FONT.REGULAR, color: constants.COLOR.DARK, fontSize: constants.FONT_SIZE.M}}>
                  {moment(createdAtTime).format('MMM D, YYYY hh:mm A')}
                  {/* {(parseFloat(delivery.price) * parseFloat(delivery.comRate)).toFixed(2)} */}
                </Text>
              </View>

              {booking.paymentMethod == 'CASH' ? (
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                  <Image source={CashIcon} resizeMode="contain" style={{width: 17, height: 15, marginRight: 8}} />
                  <Text
                    style={{
                      fontFamily: FONT.REGULAR,
                      color: constants.COLOR.YELLOW,
                      fontSize: constants.FONT_SIZE.M,
                    }}>
                    Cash
                  </Text>
                </View>
              ) : (
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                  <Image
                    source={ToktokWalletOutline}
                    resizeMode="contain"
                    style={{width: 17, height: 15, marginRight: 8}}
                  />
                  <Text
                    style={{
                      fontFamily: FONT.REGULAR,
                      color: constants.COLOR.YELLOW,
                      fontSize: constants.FONT_SIZE.M,
                    }}>
                    toktok
                    <Text
                      style={{
                        fontFamily: FONT.REGULAR,
                        color: constants.COLOR.ORANGE,
                        fontSize: constants.FONT_SIZE.M,
                      }}>
                      wallet
                    </Text>
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={{borderBottomWidth: 1, borderColor: constants.COLOR.LIGHT}} />
        <View style={styles.directionDetail}>
          {/*-------------------- ORDER DATE --------------------*/}
          <View>
            <Text style={{fontFamily: FONT.REGULAR, fontSize: constants.FONT_SIZE.M}}>Distance</Text>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
              <Image source={MapIcon} resizeMode="contain" style={{width: 17, height: 15, marginRight: 8}} />
              <Text style={{fontFamily: FONT.REGULAR, color: constants.COLOR.DARK, fontSize: constants.FONT_SIZE.M}}>
                {booking.route.distance.kilometer} km
              </Text>
            </View>
          </View>
          <View style={{flex: 1, marginLeft: 70}}>
            <Text style={{fontFamily: FONT.REGULAR, fontSize: constants.FONT_SIZE.M}}>Estimated Time of Drop off</Text>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
              <Image source={ClockIcon} resizeMode="contain" style={{width: 16, height: 16, marginRight: 8}} />
              <Text style={{fontFamily: FONT.REGULAR, color: constants.COLOR.DARK, fontSize: constants.FONT_SIZE.M}}>
                {minTime} - {maxTime}
              </Text>
            </View>
          </View>
        </View>
        <View style={{borderBottomWidth: 1, borderColor: constants.COLOR.LIGHT}} />
        <View style={styles.directionDetail}>
          {/*-------------------- ORDER DATE --------------------*/}
          <View style={{flex: 1}}>
            <Text style={{fontFamily: FONT.REGULAR, fontSize: constants.FONT_SIZE.M}}>Passenger</Text>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
              <Image source={PassengerIcon} resizeMode="contain" style={{width: 17, height: 15, marginRight: 8}} />
              <Text style={{fontFamily: FONT.REGULAR, color: constants.COLOR.DARK, fontSize: constants.FONT_SIZE.M}}>
                {booking.passengerCount}
              </Text>
            </View>
          </View>
        </View>
        <View style={{borderBottomWidth: 1, borderColor: constants.COLOR.LIGHT}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: constants.COLOR.WHITE,
    // alignItems: 'center',
  },
  directionDetail: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 16,
  },
  directionsBox: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
});
