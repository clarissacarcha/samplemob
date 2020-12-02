import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {throttle} from 'lodash';

import EIcon from 'react-native-vector-icons/Entypo';

import {COLOR, DARK, LIGHT, MEDIUM} from '../../../../../res/constants';
import {YellowIcon} from '../../../../../components/ui';

const BookingSummaryCard = ({bookingData}) => {
  const navigation = useNavigation();

  const onCardPress = throttle(
    () => {
      navigation.push('DeliveryDetails', {bookingData});
    },
    1000,
    {trailing: false},
  );

  return (
    <TouchableHighlight style={styles.touchable} onPress={onCardPress} underlayColor={COLOR}>
      <View style={styles.summaryCard}>
        <View style={styles.row}>
          {/*-------------------- ICON COLUMN --------------------*/}
          <View style={styles.markerColumn}>
            <YellowIcon set="FontAwesome5" name="map-pin" darkIcon />
            <EIcon name="flow-line" size={26} color={DARK} style={styles.flowLine} />
            <YellowIcon set="FontAwesome5" name="map-marker-alt" darkIcon />
          </View>
          <View style={styles.senderRecipientContainer}>
            {/*-------------------- SENDER --------------------*/}
            <View style={styles.senderRecipient}>
              <Text style={styles.font}>{bookingData.senderStop.name}</Text>
              <Text numberOfLines={1} style={styles.address}>
                {bookingData.senderStop.formattedAddress}
              </Text>
            </View>
            <View style={{borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: LIGHT}} />
            {/*-------------------- RECIPIENT --------------------*/}
            <View style={styles.senderRecipient}>
              {bookingData.recipientStop[0].name ? (
                <>
                  <Text style={styles.font}>{bookingData.recipientStop[0].name}</Text>
                  <Text numberOfLines={1} style={styles.address}>
                    {bookingData.recipientStop[0].formattedAddress}
                  </Text>
                </>
              ) : (
                <Text style={styles.font}>Recipient</Text>
              )}
            </View>
          </View>
        </View>

        {/*--------------- PRICING DISTANCE DURATION ---------------*/}
        {bookingData.price !== 0 && (
          <View style={styles.directionsBox}>
            <View style={styles.directionDetail}>
              <YellowIcon set="MaterialCommunity" name="map-marker-distance" />
              <Text style={styles.detailsFont}>
                {bookingData.distance.toFixed(2)}
                <Text style={{color: MEDIUM}}> km</Text>
              </Text>
            </View>
            <View style={styles.directionDetail}>
              <YellowIcon set="MaterialCommunity" name="timelapse" />
              <Text style={styles.detailsFont}>
                {bookingData.duration.toFixed(0)}
                <Text style={{color: MEDIUM}}> min</Text>
              </Text>
            </View>
            <View style={styles.directionDetail}>
              <YellowIcon set="Ionicon" name="md-pricetag" />
              <View style={{}}>
                {bookingData.discount !== 0 && (
                  <>
                    <View style={styles.discountSlash} />
                    <Text style={styles.discountFont}>₱{bookingData.price + bookingData.discount}.00</Text>
                  </>
                )}
                <Text style={styles.detailsFont}>₱{bookingData.price}.00</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </TouchableHighlight>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
  constants: state.constants,
});

export default connect(mapStateToProps, null)(BookingSummaryCard);

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: 20,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
  },
  summaryCard: {
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
    paddingHorizontal: 20,
  },
  senderRecipientContainer: {
    flex: 1,
  },
  senderRecipient: {
    height: 50,
    justifyContent: 'center',
  },
  font: {
    fontFamily: 'Rubik-Medium',
  },
  detailsFont: {
    fontFamily: 'Rubik-Medium',
    marginLeft: 10,
    fontSize: 14,
  },
  discountFont: {
    fontFamily: 'Rubik-Medium',
    color: MEDIUM,
    marginLeft: 10,
    fontSize: 14,
  },
  discountSlash: {
    position: 'absolute',
    // transform: [{rotate: '10deg'}],
    top: 7,
    left: 5,
    width: 65,
    borderBottomColor: 'red',
    borderBottomWidth: 1.5,
    zIndex: 1,
  },
  address: {
    color: MEDIUM,
    fontSize: 10,
  },
  markerColumn: {
    justifyContent: 'center',
    marginRight: 10,
  },
  flowLine: {
    right: 1,
  },
  directionsBox: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LIGHT,
    alignItems: 'center',
  },
  directionDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
