import React, {useRef} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import LocationIcon from '../../../../assets/images/locationIcon.png';
import PinIcon from '../../../../assets/images/pinIcon.png';
import ArrowRightIcon from '../../../../assets/icons/arrow-right-icon.png';
import OfficeIcon from '../../../../assets/icons/office-address-icon.png';

export const BookingMap = ({}) => {
  const mapRef = useRef();
  const INITIAL_REGION = {
    latitude: 11.22309004847093,
    latitudeDelta: 19.887065883877668,
    longitude: 121.97818368673325,
    longitudeDelta: 10.145791545510278,
  };

  const FROM = {
    latitude: 13.357554369495743,
    longitude: 123.71824264526369,
  };

  const TO = {
    latitude: 13.283971976125885,
    longitude: 123.67090702056886,
  };
  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{height: '60%', width: '100%'}}
      initialRegion={INITIAL_REGION}>
      <Marker
        key={key => {
          1;
        }}
        coordinate={FROM}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.originLocation}>
            <View style={{flexDirection: 'row'}}>
              <Image source={OfficeIcon} resizeMode={'contain'} style={{height: 20, width: 15, marginRight: 5}} />
              <Text style={{fontSize: CONSTANTS.FONT_SIZE.S, color: CONSTANTS.COLOR.ORANGE}}>Office</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}}>Palawan Tabaco...</Text>
              <Image source={ArrowRightIcon} resizeMode={'contain'} style={{height: 10, width: 10}} />
            </View>
          </View>
          <Image source={LocationIcon} resizeMode={'contain'} style={{height: 26, width: 26}} />
        </View>
      </Marker>

      <Marker
        key={key => {
          2;
        }}
        coordinate={TO}>
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <View style={styles.pinLocation}>
            <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}}>Mayon Skyline...</Text>
            <Image source={ArrowRightIcon} resizeMode={'contain'} style={{height: 10, width: 10}} />
          </View>
          <Image source={PinIcon} resizeMode={'contain'} style={{height: 26, width: 26}} />
        </View>
      </Marker>
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
