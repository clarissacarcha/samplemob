import React, {useRef, useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Text, View, StyleSheet, StatusBar, TouchableOpacity, Image, BackHandler} from 'react-native';
import {Pickup, ConfirmPickupButton, NotesToDriver} from './Sections';
import constants from '../../../common/res/constants';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';
import {SheetManager} from 'react-native-actions-sheet';
import {GET_QUOTATION, GET_PLACE_BY_LOCATION} from '../../graphql';
import {TOKTOK_QUOTATION_CLIENT} from '../../../graphql';
import {useDispatch, useSelector} from 'react-redux';
import {useLazyQuery} from '@apollo/react-hooks';
import {decodeLegsPolyline} from '../../helpers';
import {MAP_DELTA_LOW} from '../../../res/constants';

const ToktokGoBookingConfirmPickup = ({navigation, route}) => {
  const {popTo} = route.params;
  const dispatch = useDispatch();
  const dropDownRef = useRef(null);
  const {destination, origin} = useSelector(state => state.toktokGo);
  const [mapRegion, setMapRegion] = useState({...origin.place.location, ...MAP_DELTA_LOW});
  console.log('DESTINATION: ', destination, 'ORIGIN: ', origin);
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.pop(popTo);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress); // detect back button press
      return () => BackHandler.removeEventListener('hardwareBackPress');
    }, [navigation]),
  );

  const [getQuotation] = useLazyQuery(GET_QUOTATION, {
    client: TOKTOK_QUOTATION_CLIENT,
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
      navigation.push('ToktokGoBookingSummary', {
        popTo: popTo + 1,
        quotationDataResult: response.getQuotation.quotation,
        decodedPolyline: decodeLegsPolyline(response.getQuotation.quotation.route.legs),
      });
    },
    onError: error => console.log('error', error),
  });

  const onConfirm = () => {
    getQuotation();
  };

  const [getPlaceByLocation] = useLazyQuery(GET_PLACE_BY_LOCATION, {
    client: TOKTOK_QUOTATION_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      console.log('getPlaceByLocation', response);
      dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload: response.getPlaceByLocation});
    },
    onError: error => console.log('error', error),
  });
  const onDragEndMarker = e => {
    setMapRegion(e);
    getPlaceByLocation({
      variables: {
        input: {
          location: {
            latitude: e.latitude,
            longitude: e.longitude,
          },
        },
      },
    });
  };
  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop(popTo)}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </TouchableOpacity>
      <Pickup onDragEndMarker={onDragEndMarker} mapRegion={mapRegion} />
      <View style={styles.card}>
        <NotesToDriver dropDownRef={dropDownRef} navigation={navigation} popTo={popTo} />
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
