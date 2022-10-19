import React, {useState, useEffect, useRef} from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, TouchableOpacity, StyleSheet, Platform} from 'react-native';

import {COLOR} from 'res/variables';
import {MAP_DELTA_LOW} from 'res/constants';

import {verticalScale, scale, getStatusbarHeight} from 'toktokfood/helper/scale';

import {useDispatch} from 'react-redux';

import {saveUserLocation} from 'toktokfood/helper/PersistentLocation';

// Helpers
import {getFormattedAddress} from 'toktokfood/helper';

import {PickUpDetails} from './component';

const PHILIPPINE_REGION = {
  latitude: 11.22309004847093,
  latitudeDelta: 19.887065883877668,
  longitude: 121.97818368673325,
  longitudeDelta: 10.145791545510278,
};

const ToktokFoodMapSearch = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const mapViewRef = useRef(null);
  const [mapMoveCount, setMapMoveCount] = useState(0);

  const [mapInfo, setMapInfo] = useState({});

  useEffect(() => {
    if (route.params) {
      const {coordinates, address} = route.params;
      setMapInfo({
        coordinates: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
        address,
        fullInfo: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          address,
        },
      });
    }
  }, [route.params]);

  const onMapMove = async c => {
    setMapMoveCount(prevState => prevState + 1);

    const {latitude, longitude} = c;

    if (mapMoveCount === 0) {
      return;
    }

    try {
      const result = await getFormattedAddress(latitude, longitude);
      const payload = {
        latitude,
        longitude,
        address: result.formattedAddress,
      };
      setMapInfo({
        coordinates: {latitude, longitude},
        address: result.formattedAddress,
        fullInfo: payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onConfirmAddress = details => {
    saveUserLocation({mapInfo: {...mapInfo.fullInfo}, details: {...details}}).then(() => {
      dispatch({type: 'SET_TOKTOKFOOD_LOCATION', payload: {...mapInfo.fullInfo}});
      dispatch({type: 'SET_TOKTOKFOOD_ORDER_RECEIVER', payload: {...details}});
    });
    if (route.params?.cartRefetch) {
      route.params?.cartRefetch();
    }
  };

  const closeMap = () => {
    navigation.goBack();
  };

  const onMapReady = () => {
    if (route.params) {
      const {coordinates} = route.params;
      const isCoordinate = !isNaN(coordinates.latitude) && !isNaN(coordinates.longitude);
      if (isCoordinate) {
        return mapViewRef.current.animateToRegion(
          {
            latitude: parseFloat(coordinates.latitude),
            longitude: parseFloat(coordinates.longitude),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          },
          1000,
        );
      }
    }
    return mapViewRef.current.animateToRegion(PHILIPPINE_REGION, 1000);
  };

  return (
    <>
      <View style={styles.container}>
        {mapInfo?.coordinates?.latitude && mapInfo?.coordinates?.longitude ? (
          <View style={styles.mapViewContainer}>
            <MapView
              ref={mapViewRef}
              onLayout={() => setTimeout(() => onMapReady(), 500)}
              style={styles.mapView}
              provider={PROVIDER_GOOGLE}
              initialRegion={PHILIPPINE_REGION}
              onRegionChangeComplete={r => onMapMove(r)}
            />

            <FA5Icon style={styles.mapMarker} name="map-pin" size={40} color={COLOR.BLACK} />
          </View>
        ) : null}
        <TouchableOpacity onPress={() => closeMap()} style={[styles.floatingBackButton, styles.floatingBoxShadow]}>
          <FA5Icon name="chevron-left" size={25} color={COLOR.BLACK} />
        </TouchableOpacity>
      </View>
      <PickUpDetails isCart={route.params?.isCart} pinAddress={mapInfo.address} onConfirm={d => onConfirmAddress(d)} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    ...StyleSheet.absoluteFillObject,
  },
  floatingBackButton: {
    width: 48,
    height: 48,
    display: 'flex',
    borderRadius: 50,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.LIGHT,
    marginStart: Platform.OS === 'android' ? 10 : scale(15),
    marginTop: Platform.OS === 'android' ? getStatusbarHeight + 8 : verticalScale(20),
  },
  floatingBoxShadow: {
    shadowColor: '#949494',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapView: {
    height: 600,
    width: '100%',
  },
  mapViewContainer: {
    height: '53%',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  mapMarker: {
    position: 'absolute',
    alignSelf: 'center',
    paddingBottom: 35,
  },
});

export default React.memo(ToktokFoodMapSearch);
