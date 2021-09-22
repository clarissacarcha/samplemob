import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {MAP_DELTA_LOW} from 'res/constants';
import {rider_ic, customer_map_ic} from 'toktokfood/assets/images';

const RiderMapView = (props) => {
  const {customerCoordinates, riderCoordinates} = props;
  delete riderCoordinates.lastUpdate;
  const mafRef = useRef(null);

  useEffect(() => {}, []);

  const triggerMapAnimateCamera = (coordinates) => {
    mafRef.current.animateCamera(
      {
        center: coordinates,
        zoom: 17,
        pitch: 0,
        heading: 0,
        altitude: 0,
      },
      {
        duration: 500,
      },
    );
  };

  return (
    <>
      <View style={styles.container}>
        <MapView
          onMapReady={() => triggerMapAnimateCamera({...riderCoordinates})}
          ref={mafRef}
          style={styles.mapView}
          provider={PROVIDER_GOOGLE}
          region={{...MAP_DELTA_LOW, ...riderCoordinates}}>
          <Marker identifier="rider" coordinate={riderCoordinates} showsTraffic={true}>
            <Image style={{width: 55, height: 55}} resizeMode="contain" source={rider_ic} />
          </Marker>
          <Marker identifier="customer" coordinate={{latitude: customerCoordinates.latitude, longitude: customerCoordinates.longitude}} showsTraffic={true}>
            <Image style={{width: 55, height: 55}} resizeMode="contain" source={customer_map_ic} />
          </Marker>
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
