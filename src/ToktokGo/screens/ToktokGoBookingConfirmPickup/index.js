import React, {useRef, useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Text, View, StyleSheet, StatusBar, TouchableOpacity, Image, BackHandler} from 'react-native';
import {Pickup, ConfirmPickupButton, NotesToDriver} from './Sections';
import constants from '../../../common/res/constants';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';
import {SheetManager} from 'react-native-actions-sheet';
import {GET_QUOTATION, GET_PLACE_BY_LOCATION} from '../../graphql';
import {TOKTOK_QUOTATION_GRAPHQL_CLIENT} from '../../../graphql';
import {useDispatch, useSelector} from 'react-redux';
import {useLazyQuery} from '@apollo/react-hooks';
import {decodeLegsPolyline, useDebounce} from '../../helpers';
import {MAP_DELTA_LOW} from '../../../res/constants';
import {throttle} from 'lodash';

const ToktokGoBookingConfirmPickup = ({navigation, route}) => {
  const {popTo} = route.params;
  const dispatch = useDispatch();
  const dropDownRef = useRef(null);
  const {details, destination, origin} = useSelector(state => state.toktokGo);
  const [mapRegion, setMapRegion] = useState({...origin.place.location, ...MAP_DELTA_LOW});
  const [initialRegionChange, setInitialRegionChange] = useState(true);
  const [note, setNote] = useState('');
  const [getQuotation] = useLazyQuery(GET_QUOTATION, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        service: 'GO',
        origin: {
          placeHash: origin.hash,
        },
        destinations: {
          placeHash: destination.hash,
        },
      },
    },
    onCompleted: response => {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_ROUTE', payload: response.getQuotation.quotation.route});
      dispatch({type: 'SET_TOKTOKGO_BOOKING_DETAILS', payload: {...details, noteToDriver: note}});
      navigation.replace('ToktokGoBookingSummary', {
        popTo: popTo + 1,
        quotationDataResult: response.getQuotation.quotation,
        decodedPolyline: decodeLegsPolyline(response.getQuotation.quotation.route.legs),
      });
    },
    onError: error => console.log('error', error),
  });

  const onConfirm = throttle(getQuotation, 1000, {trailing: false});
  const [getPlaceByLocation] = useLazyQuery(GET_PLACE_BY_LOCATION, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload: response.getPlaceByLocation});
    },
    onError: error => console.log('error', error),
  });

  const debouncedRequest = useDebounce(
    value =>
      getPlaceByLocation({
        variables: {
          input: {
            location: {
              latitude: value.latitude,
              longitude: value.longitude,
            },
          },
        },
      }),
    1000,
  );

  const onDragEndMarker = e => {
    if (!initialRegionChange) {
      setMapRegion(e);
      debouncedRequest(e);
    }
    setInitialRegionChange(false);
  };
  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop()}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </TouchableOpacity>
      {mapRegion.latitude && <Pickup onDragEndMarker={onDragEndMarker} mapRegion={mapRegion} />}
      <View style={styles.card}>
        <NotesToDriver dropDownRef={dropDownRef} navigation={navigation} popTo={popTo} note={note} setNote={setNote} />
        <ConfirmPickupButton onConfirm={onConfirm} />
      </View>
    </View>
  );
};

export default ToktokGoBookingConfirmPickup;

const styles = StyleSheet.create({
  card: {
    right: -4.5,
    width: '102%',
    borderWidth: 3,
    borderTopColor: constants.COLOR.ORANGE,
    borderLeftColor: constants.COLOR.ORANGE,
    borderRightColor: constants.COLOR.ORANGE,
    borderBottomColor: constants.COLOR.WHITE,
    position: 'absolute',
    paddingTop: 13,
    paddingHorizontal: 16,
    bottom: 0,
    // zIndex: 999,
    backgroundColor: constants.COLOR.WHITE,
    // marginTop: 8,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: constants.COLOR.LIGHT,
    marginVertical: 16,
    marginHorizontal: -16,
  },
  iconDimensions: {
    width: 10,
    height: 15,
  },
  backButton: {
    zIndex: 999,
    backgroundColor: constants.COLOR.WHITE,
    position: 'absolute',
    top: StatusBar.currentHeight + 23,
    left: 16,
    padding: 6,
    borderRadius: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
