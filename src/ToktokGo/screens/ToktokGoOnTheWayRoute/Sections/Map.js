import React, {useRef, useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import LocationIcon from '../../../../assets/images/locationIcon.png';
import constants from '../../../../common/res/constants';
import CarImage from '../../../../assets/images/car1.png';
export const Map = ({booking, originData, driverCoordinates}) => {
  const mapRef = useRef();

  const INITIAL_REGION = {
    latitude: 11.22309004847093,
    latitudeDelta: 19.887065883877668,
    longitude: 121.97818368673325,
    longitudeDelta: 10.145791545510278,
  };

  const ORIGIN = {
    latitude: booking?.route?.origin?.location?.latitude,
    longitude: booking?.route?.origin?.location?.longitude,
  };

  const TO = {
    latitude: booking?.route?.destinations[0]?.location?.latitude,
    longitude: booking?.route?.destinations[0]?.location?.longitude,
  };

  const onMapReady = async () => {
    setTimeout(() => {
      try {
        mapRef.current.fitToCoordinates(
          [['ARRIVED', 'ACCEPTED'].includes(booking.status) ? ORIGIN : TO],
          {
            edgePadding: {
              right: 100,
              bottom: 200,
              left: 100,
              top: 100,
            },
          },
          3000, // Animation duration in milliseconds.
        );
      } catch (err) {
        console.log('fitToCoordinates error: ', err);
      }
    }, 1000);
  };

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{height: '100%', width: '100%'}}
      initialRegion={INITIAL_REGION}
      onMapReady={onMapReady}>
      <Marker
        key={key => {
          1;
        }}
        coordinate={originData ? INITIAL_REGION : ORIGIN}>
        <View style={{alignItems: 'center'}}>
          <FA5Icon name="map-pin" size={34} color={CONSTANTS.COLOR.YELLOW} style={{marginLeft: 2}} />
        </View>
      </Marker>
      <Marker
        key={key => {
          3;
        }}
        coordinate={originData ? INITIAL_REGION : TO}>
        <View style={{alignItems: 'center'}}>
          <Image source={LocationIcon} style={{height: 36, width: 36}} resizeMode="contain" />
        </View>
      </Marker>
      {driverCoordinates && (
        <Marker
          key={key => {
            2;
          }}
          coordinate={driverCoordinates}>
          <View style={{alignItems: 'center'}}>
            <Image source={CarImage} style={{height: 30, width: 30}} resizeMode="contain" />
          </View>
        </Marker>
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  pinLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CONSTANTS.COLOR.WHITE,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 4,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  originLocation: {
    backgroundColor: CONSTANTS.COLOR.WHITE,
    marginBottom: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
});
