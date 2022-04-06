import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';

export const DestinationMap = ({onDragEndMarker}) => {
  const {destination, origin} = useSelector(state => state.toktokGo);
  const mapRef = useRef();
  const INITIAL_REGION = {
    latitude: 11.22309004847093,
    latitudeDelta: 19.887065883877668,
    longitude: 121.97818368673325,
    longitudeDelta: 10.145791545510278,
  };

  useEffect(() => {
    setTimeout(() => {
      mapRef.current.fitToCoordinates(
        [destination?.place?.location?.latitude ? destination.place.location : origin.place.location],
        {
          edgePadding: {
            right: 100,
            bottom: 100,
            left: 100,
            top: 100,
          },
        },
        3000, // Animation duration in milliseconds.
      );
    }, 1000);
  }, [destination.place.location]);

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{height: '90%', width: '100%'}}
      initialRegion={INITIAL_REGION}>
      <Marker
        key={key => {
          1;
        }}
        coordinate={destination?.place?.location?.latitude ? destination.place.location : origin.place.location}
        draggable
        onDragEnd={e => {
          onDragEndMarker(e.nativeEvent.coordinate);
        }}>
        <View style={{alignItems: 'center'}}>
          <FA5Icon name="map-marker-alt" size={20} color={CONSTANTS.COLOR.ORANGE} />
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
