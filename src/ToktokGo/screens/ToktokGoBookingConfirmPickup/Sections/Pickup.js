import React, {useRef, useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import {ThrottledOpacity} from '../../../../components_section';
import LottieView from 'lottie-react-native';

const lottieLoading = require('../../../../assets/JSON/loader.json');

export const Pickup = ({fakeLoading, setFakeLoading, onDragEndMarker, mapRegion, loading}) => {
  const {origin} = useSelector(state => state.toktokGo);
  const mapRef = useRef();
  const [mapMoveCount, setMapMoveCount] = useState(0);
  const [mapMoved, setMapMoved] = useState(false);
  const [mapMovedCoordinates, setMapMovedCoordinates] = useState(null);
  const [showUpdated, setShowUpdated] = useState(false);

  const onPressMapUpdate = () => {
    setFakeLoading(true);
    onDragEndMarker(mapMovedCoordinates);
  };

  useEffect(() => {
    if (!fakeLoading) {
      setShowUpdated(true);

      setTimeout(() => {
        setShowUpdated(false);
        setMapMoved(false);
      }, 1500);
    }
  }, [fakeLoading]);

  const onMapMove = e => {
    setMapMoveCount(prevState => prevState + 1);
    if (mapMoveCount === 0) {
      return;
    }
    setMapMoved(true);
    setFakeLoading(false);
    setMapMovedCoordinates(e);
  };
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{height: '100%', width: '100%'}}
        initialRegion={{...mapRegion}}
        onPanDrag={e => {
          setMapMoved(false);
        }}
        onRegionChangeComplete={e => onMapMove(e)}></MapView>
      {mapMoved && (
        <View style={styles.mapUpdateContainer}>
          <ThrottledOpacity style={styles.mapUpdate} onPress={onPressMapUpdate} disabled={fakeLoading}>
            {fakeLoading ? (
              <LottieView source={lottieLoading} autoPlay loop style={styles.loader} resizeMode="cover" />
            ) : (
              <Text
                style={{
                  color: CONSTANTS.COLOR.WHITE,
                  fontSize: CONSTANTS.FONT_SIZE.M,
                  fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
                }}>
                {showUpdated ? 'Updated!' : 'Update Location'}
              </Text>
            )}
          </ThrottledOpacity>
        </View>
      )}
      <View style={{alignItems: 'center', zIndex: 999, alignContent: 'center', position: 'absolute'}}>
        <FA5Icon name="map-pin" size={18} color={CONSTANTS.COLOR.YELLOW} style={{marginLeft: 2}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // ...StyleSheet.absoluteFillObject,
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
  loader: {
    alignSelf: 'center',
    margin: -10,
    top: Platform.OS === 'ios' ? 6 : 4,
    width: 50,
    aspectRatio: 1.5,
  },
});
