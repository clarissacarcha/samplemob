import React, {useRef} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

import MapViewDirections from 'react-native-maps-directions';
import {rider_ic} from 'toktokfood/assets/images';

import {useSelector} from 'react-redux';
import CONSTANTS from 'common/res/constants';

const {COLOR, MAP_DELTA_LOW} = CONSTANTS;

import {MAPS_API_KEY} from 'res/constants';

const RiderMapView = (props) => {
  const {customerCoordinates, riderCoordinates} = props;
  delete riderCoordinates.lastUpdate;
  const mapRef = useRef(null);

  const {user} = useSelector((state) => state.session);

  const fitMarkersViews = (coordinates) => {
    mapRef.current.fitToCoordinates(
      coordinates,
      {
        edgePadding: {
          right: 20,
          bottom: 100,
          left: 20,
          top: 90,
        },
      },
      3000,
    );
  };

  return (
    <>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.mapView}
          provider={PROVIDER_GOOGLE}
          region={{...MAP_DELTA_LOW, ...riderCoordinates}}>
          <Marker identifier="rider" coordinate={riderCoordinates} showsTraffic={true}>
            <Image style={{width: 55, height: 55}} resizeMode="contain" source={rider_ic} />
          </Marker>
          <Marker
            identifier="customer"
            coordinate={{latitude: customerCoordinates.latitude, longitude: customerCoordinates.longitude}}
            showsTraffic={true}>
            <Image
              style={{width: 55, height: 55, borderRadius: 50, borderColor: COLOR.ORANGE}}
              resizeMode="contain"
              source={{uri: user.person.avatar}}
            />
          </Marker>
          <MapViewDirections
            origin={customerCoordinates}
            destination={riderCoordinates}
            strokeColor={COLOR.ORANGE}
            strokeWidth={6}
            mode="DRIVING"
            precision="high"
            apikey={MAPS_API_KEY}
            onReady={(result) => fitMarkersViews(result.coordinates)}
          />
        </MapView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
});

export default React.memo(RiderMapView);
