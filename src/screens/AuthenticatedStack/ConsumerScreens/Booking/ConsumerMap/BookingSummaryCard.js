import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {BookingOverlay, LocationPermission, WelcomeBanner, WelcomeMessage} from '../../../../../components';
import {COLOR, DARK, LIGHT, MAPS_API_KEY, MEDIUM} from '../../../../../res/constants';
import {GET_ORDER_PRICE, GET_WELCOME_MESSAGE, POST_DELIVERY} from '../../../../../graphql';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import MapBoxPolyline from '@mapbox/polyline';
import {PERMISSIONS, RESULTS, check} from 'react-native-permissions';
import React, {useEffect, useRef, useState} from 'react';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {useNavigation} from '@react-navigation/native';

import EIcon from 'react-native-vector-icons/Entypo';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FIcon from 'react-native-vector-icons/Feather';
import MapViewDirections from 'react-native-maps-directions';
import OneSignal from 'react-native-onesignal';
import ToktokLogo from '../../../../../assets/icons/ToktokLogo.png';
import {YellowIcon} from '../../../../../components/ui';
import {connect} from 'react-redux';
import {currentLocation} from '../../../../../helper';
import {onError} from '../../../../../util/ErrorUtility';

const BookingSummaryCard = ({bookingData}) => {
  const navigation = useNavigation();

  return (
    <TouchableHighlight
      style={{marginHorizontal: 20, borderRadius: 10}}
      onPress={() => navigation.push('DeliveryDetails', {bookingData})}
      underlayColor={COLOR}>
      <View style={styles.taskBox}>
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
              <Text style={{fontFamily: 'Rubik-Medium'}}>{bookingData.senderStop.name}</Text>
              <Text numberOfLines={1} style={{color: MEDIUM, fontSize: 10}}>
                {bookingData.senderStop.formattedAddress}
              </Text>
            </View>
            <View style={{borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: LIGHT}} />
            {/*-------------------- RECIPIENT DETAILS --------------------*/}
            <View style={{height: 50, justifyContent: 'center'}}>
              {bookingData.recipientStop[0].name ? (
                <>
                  <Text style={{fontFamily: 'Rubik-Medium'}}>{bookingData.recipientStop[0].name}</Text>
                  <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 10}}>
                    {bookingData.recipientStop[0].formattedAddress}
                  </Text>
                </>
              ) : (
                <Text style={{fontFamily: 'Rubik-Medium'}}>Recipient</Text>
              )}
            </View>
          </View>
          {/*---------------------------------------- ROUTE DETAILS ----------------------------------------*/}
          {/* {directions.distance != 0 && (
        <View style={styles.directionsBox}>
          <View style={styles.directionDetail}>
            <YellowIcon set="MaterialCommunity" name="map-marker-distance" />
            <Text style={{fontFamily: 'Rubik-Medium', marginLeft: 10, fontSize: 12}}>
              {directions.distance.toFixed(2)}
              <Text style={{color: MEDIUM}}> km</Text>
            </Text>
          </View>
          <View style={styles.directionDetail}>
            <YellowIcon set="MaterialCommunity" name="timelapse" />
            <Text style={{fontFamily: 'Rubik-Medium', marginLeft: 10, fontSize: 12}}>
              {directions.duration.toFixed(0)}
              <Text style={{color: MEDIUM}}> min</Text>
            </Text>
          </View>
          <View style={styles.directionDetail}>
            <YellowIcon set="Ionicon" name="md-pricetag" />
            {price == 0 || price == '0' ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 12, marginHorizontal: 10, fontFamily: 'Rubik-Medium', color: MEDIUM}}>
                  Price
                </Text>
                <ActivityIndicator size={20} color={COLOR} />
              </View>
            ) : (
              <Text style={{fontFamily: 'Rubik-Medium', marginLeft: 10}}>
                ₱{price + recipient[recipientIndex].expressFee}.00
              </Text>
            )}
          </View>
        </View>
      )} */}
          {/*-------------------- Express Delivery --------------------*/}
        </View>
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
  container: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9,
  },
  menuBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 20,
    borderRadius: 10,
  },
  branding: {
    position: 'absolute',
    top: 0,
    left: 70,
    marginTop: 20,
    borderRadius: 10,
  },
  brandingImage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 10,
  },
  menu: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    backgroundColor: DARK,
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
  submitBox: {
    margin: 20,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBox: {
    backgroundColor: COLOR,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    overflow: 'hidden',
  },
  iconBoxDark: {
    backgroundColor: DARK,
    overflow: 'hidden',
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
  },
  directionsBox: {
    height: 50,
    marginHorizontal: 20,
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
