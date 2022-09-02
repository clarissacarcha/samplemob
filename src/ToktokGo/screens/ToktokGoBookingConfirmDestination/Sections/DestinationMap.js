import React, {useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {MAP_DELTA_LOW} from '../../../../res/constants';
import DestinationIcon from '../../../../assets/icons/DestinationIcon.png';

export const DestinationMap = ({onDragEndMarker, mapRegion}) => {
  const INITIAL_REGION = {
    latitude: 14.584027386653853,
    longitude: 121.0634614077012,
    ...MAP_DELTA_LOW,
  };

  useEffect(() => {
    if (!mapRegion.latitude) {
      onDragEndMarker({latitude: INITIAL_REGION.latitude, longitude: INITIAL_REGION.longitude});
    }
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{height: '100%', width: '100%'}}
        initialRegion={mapRegion.latitude ? {...mapRegion} : {...INITIAL_REGION}}
        onRegionChangeComplete={e => {
          onDragEndMarker(e);
        }}></MapView>
      <View style={{alignItems: 'center', zIndex: 999, alignContent: 'center', position: 'absolute'}}>
        <Image source={DestinationIcon} style={{height: 20, width: 35}} resizeMode={'contain'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject,
    // position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
