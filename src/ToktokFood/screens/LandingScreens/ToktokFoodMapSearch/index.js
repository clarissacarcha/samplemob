import React, {useState, useEffect, useRef} from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, TouchableOpacity, StyleSheet, Platform, Text} from 'react-native';

import {COLOR} from 'res/variables';
import {MAP_DELTA_LOW} from 'res/constants';

import {verticalScale, scale, getStatusbarHeight} from 'toktokfood/helper/scale';

import {useDispatch} from 'react-redux';

import {saveUserLocation} from 'toktokfood/helper/PersistentLocation';

// Helpers
import {getFormattedAddress} from 'toktokfood/helper';

import {PickUpDetails} from './component';
import {ThrottledOpacity} from '../../../../components_section';
import {FONT, FONT_SIZE} from '../../../../res/variables';
import constants from '../../../../common/res/constants';
import LottieView from 'lottie-react-native';

const lottieLoading = require('../../../../assets/JSON/loader.json');

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
  const [addressLoading, setAddressLoading] = useState(false);
  const {coordinates} = route.params;
  const [mapRegion, setMapRegion] = useState(
    coordinates?.latitude ? {...coordinates, ...MAP_DELTA_LOW} : PHILIPPINE_REGION,
  );
  const [mapMoved, setMapMoved] = useState(false);
  const [movedCoordinates, setMovedCoordinates] = useState(null);
  const [showUpdated, setShowUpdated] = useState(false);
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

  const onMapMove = c => {
    setMapMoveCount(prevState => prevState + 1);
    if (mapMoveCount === 0) {
      return;
    }
    setMapMoved(true);
    setMovedCoordinates(c);
    // try {
    //   const result = await getFormattedAddress(latitude, longitude);
    //   setMapRegion(c);
    //   const payload = {
    //     latitude,
    //     longitude,
    //     address: result.formattedAddress,
    //   };
    //   setMapInfo({
    //     coordinates: {latitude, longitude},
    //     address: result.formattedAddress,
    //     fullInfo: payload,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
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

  const onPressMapUpdate = async () => {
    setAddressLoading(true);
    const {latitude, longitude} = movedCoordinates;
    try {
      const result = await getFormattedAddress(latitude, longitude);
      setMapRegion(movedCoordinates);
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
      setAddressLoading(false);
      setShowUpdated(true);

      setTimeout(() => {
        setMapMoved(false);
        setShowUpdated(false);
      }, 1500);
    } catch (error) {
      setAddressLoading(false);
      setMapMoved(false);
      console.log(error);
    }
  };

  const closeMap = () => {
    navigation.goBack();
  };

  return (
    <>
      <View style={styles.container}>
        {mapInfo?.coordinates?.latitude && mapInfo?.coordinates?.longitude ? (
          <View style={styles.mapViewContainer}>
            <MapView
              ref={mapViewRef}
              style={styles.mapView}
              provider={PROVIDER_GOOGLE}
              initialRegion={mapRegion}
              onPanDrag={e => {
                setMapMoved(false);
              }}
              onRegionChangeComplete={r => onMapMove(r)}
            />
            {mapMoved && (
              <View style={styles.mapUpdateContainer}>
                <ThrottledOpacity style={styles.mapUpdate} onPress={onPressMapUpdate}>
                  {addressLoading ? (
                    <LottieView source={lottieLoading} autoPlay loop style={styles.loader} resizeMode="cover" />
                  ) : (
                    <Text style={{color: COLOR.WHITE, fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR}}>
                      {showUpdated ? 'Updated!' : 'Update Location'}
                    </Text>
                  )}
                </ThrottledOpacity>
              </View>
            )}
            <FA5Icon style={styles.mapMarker} name="map-pin" size={40} color={COLOR.BLACK} />
          </View>
        ) : null}
        <TouchableOpacity onPress={() => closeMap()} style={[styles.floatingBackButton, styles.floatingBoxShadow]}>
          <FA5Icon name="chevron-left" size={25} color={COLOR.BLACK} />
        </TouchableOpacity>
      </View>
      <PickUpDetails
        addressLoading={addressLoading}
        isCart={route.params?.isCart}
        pinAddress={mapInfo.address}
        onConfirm={d => onConfirmAddress(d)}
      />
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
  mapUpdate: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: constants.COLOR.ORANGE,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  mapUpdateContainer: {
    position: 'absolute',
    alignSelf: 'center',
    paddingBottom: 120,
  },
  loader: {
    alignSelf: 'center',
    margin: -10,
    top: Platform.OS === 'ios' ? 6 : 4,
    width: 50,
    aspectRatio: 1.5,
  },
});

export default React.memo(ToktokFoodMapSearch);
