import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {MAP_DELTA_LOW} from '../../../../res/constants';
import DestinationIcon from '../../../../assets/icons/DestinationIcon.png';
import {ThrottledOpacity} from '../../../../components_section';

export const DestinationMap = ({onDragEndMarker, mapRegion}) => {
  const INITIAL_REGION = {
    latitude: 14.584027386653853,
    longitude: 121.0634614077012,
    ...MAP_DELTA_LOW,
  };

  const [mapMoveCount, setMapMoveCount] = useState(0);
  const [mapMoved, setMapMoved] = useState(false);
  const [mapMovedCoordinates, setMapMovedCoordinates] = useState(null);

  const onPressMapUpdate = () => {
    setMapMoved(false);
    onDragEndMarker(mapMovedCoordinates);
  };

  const onMapMove = e => {
    setMapMoveCount(prevState => prevState + 1);
    if (mapMoveCount === 0) {
      return;
    }
    setMapMoved(true);
    setMapMovedCoordinates(e);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{height: '100%', width: '100%'}}
        initialRegion={mapRegion.latitude ? {...mapRegion} : {...INITIAL_REGION}}
        onPanDrag={e => {
          setMapMoved(false);
        }}
        onRegionChangeComplete={e => onMapMove(e)}></MapView>
      {mapMoved && (
        <View style={styles.mapUpdateContainer}>
          <ThrottledOpacity style={styles.mapUpdate} onPress={onPressMapUpdate}>
            <Text
              style={{
                color: CONSTANTS.COLOR.WHITE,
                fontSize: CONSTANTS.FONT_SIZE.M,
                fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
              }}>
              Confirm Pin
            </Text>
          </ThrottledOpacity>
        </View>
      )}
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
  mapUpdate: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: CONSTANTS.COLOR.ORANGE,
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
    paddingBottom: 70,
  },
});
