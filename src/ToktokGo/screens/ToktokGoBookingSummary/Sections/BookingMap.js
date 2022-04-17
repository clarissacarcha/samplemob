import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Image, Text, TouchableWithoutFeedback, Dimensions} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import _ from 'lodash';
import CONSTANTS from '../../../../common/res/constants';
import LocationIcon from '../../../../assets/images/locationIcon.png';
import PinIcon from '../../../../assets/images/pinIcon.png';
import ArrowRightIcon from '../../../../assets/icons/arrow-right-icon.png';
import OfficeIcon from '../../../../assets/icons/office-address-icon.png';

// console.log(JSON.stringify({polyline: decodeLegsPolyline(SAMPLE_LEGS)}, null, 2));
const MAP_HEIGHT = Dimensions.get('window').height * 0.5;

export const BookingMap = ({decodedPolyline, routeDetails, origin, destination, setExpandBookingDetails}) => {
  const mapRef = useRef();
  const INITIAL_REGION = {
    latitude: 11.22309004847093,
    latitudeDelta: 19.887065883877668,
    longitude: 121.97818368673325,
    longitudeDelta: 10.145791545510278,
  };

  useEffect(() => {
    const {northeast, southwest} = routeDetails.bounds;
    const coordinates = [
      {
        ...northeast,
      },
      {
        ...southwest,
      },
    ];
    setTimeout(() => {
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
    }, 1000);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => setExpandBookingDetails(false)}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{height: MAP_HEIGHT, width: '100%'}}
        initialRegion={INITIAL_REGION}>
        <Marker
          // tracksViewChanges={false}
          key={key => {
            1;
          }}
          coordinate={origin?.place?.location}>
          <View style={{alignItems: 'center'}}>
            <View style={styles.originLocation}>
              {/* <View style={{flexDirection: 'row'}}>
                <Image source={OfficeIcon} resizeMode={'contain'} style={{height: 20, width: 15, marginRight: 5}} />
                <Text style={{fontSize: CONSTANTS.FONT_SIZE.S, color: CONSTANTS.COLOR.ORANGE}}>Office</Text>
              </View> */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}} numberOfLines={1}>
                  {origin?.place?.formattedAddress.length < 20
                    ? `${origin?.place?.formattedAddress}...`
                    : `${origin?.place?.formattedAddress.substring(0, 20)}...`}
                </Text>
                <Image source={ArrowRightIcon} resizeMode={'contain'} style={{height: 10, width: 10}} />
              </View>
            </View>
            <Image source={LocationIcon} resizeMode={'contain'} style={{height: 26, width: 26}} />
          </View>
        </Marker>

        <Marker
          // tracksViewChanges={false}
          key={key => {
            2;
          }}
          coordinate={destination?.place?.location}>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <View style={styles.pinLocation}>
              <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}} numberOfLines={1}>
                {destination?.place?.formattedAddress.length < 20
                  ? `${destination?.place?.formattedAddress}...`
                  : `${destination?.place?.formattedAddress.substring(0, 20)}...`}
              </Text>
              <Image source={ArrowRightIcon} resizeMode={'contain'} style={{height: 10, width: 10}} />
            </View>
            <Image source={PinIcon} resizeMode={'contain'} style={{height: 26, width: 26}} />
          </View>
        </Marker>

        <Polyline
          coordinates={decodedPolyline}
          strokeColor={CONSTANTS.COLOR.ORANGE} // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={3}
        />
      </MapView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  pinLocation: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, .1)',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CONSTANTS.COLOR.WHITE,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 4,

    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
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
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
});
