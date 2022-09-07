import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import _ from 'lodash';
import CONSTANTS from '../../../../common/res/constants';
import LocationIcon from '../../../../assets/images/locationIcon.png';
import PinIcon from '../../../../assets/images/pinIcon.png';
import ArrowRightIcon from '../../../../assets/icons/arrow-right-icon.png';
import OfficeIcon from '../../../../assets/icons/office-address-icon.png';

// console.log(JSON.stringify({polyline: decodeLegsPolyline(SAMPLE_LEGS)}, null, 2));
const MAP_HEIGHT = (Dimensions.get('window').height + StatusBar.currentHeight) * 0.5;

export const BookingMap = ({decodedPolyline, routeDetails, origin, destination}) => {
  const mapRef = useRef();
  const INITIAL_REGION = {
    latitude: 11.22309004847093,
    latitudeDelta: 19.887065883877668,
    longitude: 121.97818368673325,
    longitudeDelta: 10.145791545510278,
  };
  const [bounds, setBounds] = useState(routeDetails.bounds);

  const onMapReady = async () => {
    const {northeast, southwest} = bounds;
    const coordinates = [
      {
        ...northeast,
      },
      {
        ...southwest,
      },
    ];
    setTimeout(() => {
      try {
        mapRef.current.fitToCoordinates(
          coordinates,
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

  const getTime = num => {
    if (num > 60) {
      var hours = num / 60;
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
      var rminutes = Math.round(minutes);
      if (rhours > 1) {
        return rhours + ' hrs ' + rminutes + ' mins';
      } else {
        return rhours + ' hr ' + rminutes + ' mins';
      }
    } else {
      return num + ' mins';
    }
  };

  if (!destination?.place?.location?.latitude) {
    return <ActivityIndicator color={CONSTANTS.COLOR.YELLOW} />;
  }

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{height: MAP_HEIGHT, width: '100%'}}
      initialRegion={INITIAL_REGION}
      onMapReady={onMapReady}>
      <Marker
        // tracksViewChanges={false}
        key={key => {
          1;
        }}
        coordinate={origin?.place?.location}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.originLocation}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}} numberOfLines={1}>
                {origin?.place?.formattedAddress?.length < 20
                  ? `${origin?.place?.formattedAddress}...`
                  : `${origin?.place?.formattedAddress?.substring(0, 20)}...`}
              </Text>
              <Image source={ArrowRightIcon} resizeMode={'contain'} style={{height: 10, width: 10}} />
            </View>
          </View>
          <Image source={PinIcon} resizeMode={'contain'} style={{height: 26, width: 26}} />
        </View>
      </Marker>

      <Marker
        // tracksViewChanges={false}
        key={key => {
          2;
        }}
        coordinate={destination?.place?.location}>
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <View style={styles.destinationContainer}>
            <View style={styles.pinLocation}>
              <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}} numberOfLines={1}>
                {destination?.place?.formattedAddress?.length < 20
                  ? `${destination?.place?.formattedAddress}...`
                  : `${destination?.place?.formattedAddress?.substring(0, 20)}...`}
              </Text>
              <Image source={ArrowRightIcon} resizeMode={'contain'} style={{height: 10, width: 10}} />
            </View>
            <View style={[styles.pinLocation, {alignSelf: 'flex-start'}]}>
              <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}} numberOfLines={1}>
                {getTime(routeDetails?.duration?.minute)}
              </Text>
              <View style={styles.separator} />
              <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}} numberOfLines={1}>
                {routeDetails?.distance?.kilometer} km
              </Text>
            </View>
          </View>
          <Image source={LocationIcon} resizeMode={'contain'} style={{height: 26, width: 26}} />
        </View>
      </Marker>

      <Polyline
        coordinates={decodedPolyline}
        strokeColor={CONSTANTS.COLOR.ORANGE} // fallback for when `strokeColors` is not supported by the map-provider
        strokeWidth={3}
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  destinationContainer: {
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, .1)',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: CONSTANTS.COLOR.WHITE,

    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  separator: {
    width: 5,
    height: 5,
    backgroundColor: '#cccccc',
    borderRadius: 50,
    marginHorizontal: 5,
  },
  pinLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  originLocation: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, .1)',
    borderWidth: 1,
    zIndex: 999,
    backgroundColor: CONSTANTS.COLOR.WHITE,
    marginBottom: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
});
