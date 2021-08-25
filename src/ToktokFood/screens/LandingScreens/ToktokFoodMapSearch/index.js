import React, {useState, useEffect} from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, TouchableOpacity, StyleSheet, Platform} from 'react-native';

import {COLOR} from 'res/variables';
import {MAP_DELTA_LOW} from 'res/constants';

import {verticalScale, scale, getStatusbarHeight} from 'toktokfood/helper/scale';

import {useDispatch} from 'react-redux';

// Helpers
import {getFormattedAddress} from 'toktokfood/helper';

import {PickUpDetails} from './component';

const ToktokFoodMapSearch = (props) => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [address, setAddress] = useState('');
  const [mapCoordinates, setMapCoordinates] = useState(route.params.coordinates);

  const onMapMove = async (c) => {
    const {latitude, longitude} = c;
    try {
      const result = await getFormattedAddress(latitude, longitude);
      const payload = {
        latitude,
        longitude,
        address: result.formattedAddress,
      };
      setAddress(result.formattedAddress);
      setMapCoordinates({latitude, longitude});
      dispatch({type: 'SET_TOKTOKFOOD_LOCATION', payload: {...payload}});
    } catch (error) {
      console.log(error);
    }
  };

  const closeMap = () => {
    navigation.goBack();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.mapViewContainer}>
          <MapView
            style={styles.mapView}
            provider={PROVIDER_GOOGLE}
            region={{
              ...mapCoordinates,
              ...MAP_DELTA_LOW,
            }}
            onRegionChangeComplete={(r) => onMapMove(r)}></MapView>
          <FA5Icon style={styles.mapMarker} name="map-pin" size={40} color={COLOR.BLACK} />
        </View>
        <TouchableOpacity onPress={() => closeMap()} style={[styles.floatingBackButton, styles.floatingBoxShadow]}>
          <FA5Icon name="chevron-left" size={25} color={COLOR.BLACK} />
        </TouchableOpacity>
      </View>
      <PickUpDetails pinAddress={address} />
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
    flex: 1,
  },
  mapViewContainer: {
    height: '53%',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  mapMarker: {
    position: 'absolute',
    alignSelf: 'center',
  },
});

// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
// React.memo for memoizing the component.
// Do not remove the memo function to avoid multiple unwanted GMAP API request
export default React.memo(ToktokFoodMapSearch);
