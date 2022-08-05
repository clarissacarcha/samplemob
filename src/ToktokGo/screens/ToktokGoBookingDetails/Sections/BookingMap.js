import React, {useState, useRef} from 'react';
import {View, StyleSheet, Image, Platform} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import CONSTANTS from '../../../../common/res/constants';

import PinIcon from '../../../../assets/images/pinIcon.png';
import LocationIcon from '../../../../assets/images/locationIcon.png';
import {decodeLegsPolyline} from '../../../helpers';

const INITIAL_REGION = {
  latitude: 11.22309004847093,
  latitudeDelta: 19.887065883877668,
  longitude: 121.97818368673325,
  longitudeDelta: 10.145791545510278,
};

export const BookingMap = ({booking, routeDetails}) => {
  //   const SECOND_LOCATION = {latitude: delivery.senderStop.latitude, longitude: delivery.senderStop.latitude};
  const mapRef = useRef();

  const decodedPolyline = booking.route.legs ? decodeLegsPolyline(booking.route.legs) : null;

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
    try {
      mapRef.current.fitToCoordinates(
        coordinates,
        {
          edgePadding: {
            right: 10,
            bottom: 30,
            left: 10,
            top: 50,
          },
        },
        500, // Animation duration in milliseconds.
      );
    } catch (err) {
      console.log('fitToCoordinates error: ', err);
    }
  };

  return (
    <View style={styles.contentCard}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{width: '100%', height: 200}}
        initialRegion={INITIAL_REGION}
        onLayout={Platform.OS == 'android' && onMapReady}
        onMapReady={Platform.OS == 'ios' && onMapReady}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}>
        <Marker
          key={key => {
            1;
          }}
          coordinate={{
            latitude: booking.route.origin.location.latitude,
            longitude: booking.route.origin.location.longitude,
          }}>
          <Image source={LocationIcon} resizeMode={'contain'} style={{height: 36, width: 36}} />
        </Marker>

        <Marker
          key={key => {
            2;
          }}
          coordinate={{
            latitude: booking.route.destinations[0].location.latitude,
            longitude: booking.route.destinations[0].location.longitude,
          }}>
          <Image source={PinIcon} resizeMode={'contain'} style={{height: 36, width: 36}} />
        </Marker>
        {decodedPolyline && (
          <Polyline
            coordinates={decodedPolyline}
            strokeColor={CONSTANTS.COLOR.ORANGE} // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={3}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  cancelledText: {
    textAlign: 'center',
    color: CONSTANTS.COLOR.DARK,
  },
  contentCard: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
});
