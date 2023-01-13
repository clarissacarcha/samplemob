import React, {useRef, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Text, View, StyleSheet, StatusBar, KeyboardAvoidingView, Image, BackHandler} from 'react-native';
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
import {onError} from '../../../util/ErrorUtility';
import {ThrottledOpacity} from '../../../components_section';
import {AlertOverlay} from '../../../SuperApp/screens/Components';
import {useAlertGO} from '../../hooks';

const ToktokGoBookingConfirmPickup = ({navigation, route}) => {
  const {popTo, source} = route.params;
  const dispatch = useDispatch();
  const dropDownRef = useRef(null);
  const {defaultAddress} = useSelector(state => state.superApp);
  const alertGO = useAlertGO();
  const {details, destination, origin} = useSelector(state => state.toktokGo);
  const mapDefault = {
    latitude: origin?.place?.location?.latitude
      ? origin?.place?.location.latitude
      : defaultAddress.place.location.latitude,
    longitude: origin?.place?.location?.longitude
      ? origin?.place?.location.longitude
      : defaultAddress.place.location.longitude,
    ...MAP_DELTA_LOW,
  };
  const [mapRegion, setMapRegion] = useState(mapDefault);
  const [initialRegionChange, setInitialRegionChange] = useState(!mapRegion.latitude ? false : true);
  const [note, setNote] = useState('');
  const [fakeLoading, setFakeLoading] = useState(false);
  const [notes, setNotes] = useState({
    text: details?.noteToDriver ? details.noteToDriver : '',
    textLength: 0,
  });
  const notesToDriver = text => {
    if (text.length <= 320)
      setNotes({
        textLength: text.length,
        text: text,
      });
  };
  const [getQuotation, {loading}] = useLazyQuery(GET_QUOTATION, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_ROUTE', payload: response.getQuotation.quotation.route});
      dispatch({type: 'SET_TOKTOKGO_BOOKING_DETAILS', payload: {...details, noteToDriver: notes.text}});
      dispatch({
        type: 'SET_TOKTOKGO_TEMP_VEHICLE_LIST',
        payload: response.getQuotation.quotation.vehicleTypeRates.slice(0, 2),
      });
      navigation.replace('ToktokGoBookingSummary', {
        popTo: popTo + 1,
        quotationDataResult: response.getQuotation.quotation,
        decodedPolyline: decodeLegsPolyline(response.getQuotation.quotation.route.legs),
      });
    },
    onError: error => {
      const {graphQLErrors, networkError} = error;
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, errorType}) => {
          if (errorType === 'INTERNAL_SERVER_ERROR') {
            alertGO({message});
          } else if (errorType === 'BAD_USER_INPUT') {
            alertGO({message});
          } else if (errorType === 'AREA_UNSERVICEABLE') {
            alertGO({message});
          } else if (errorType === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else if (errorType === 'ExecutionTimeout') {
            alertGO({message});
          } else {
            console.log('ELSE ERROR:', error);
            // Alert.alert('', 'Something went wrong...');
            alertGO({title: 'Whooops', message: 'May kaunting aberya, ka-toktok. Keep calm and try again.'});
          }
        });
      }
    },
  });

  const onConfirm = throttle(
    () => {
      console.log('ORIGIN:', origin.hash, 'DESTINATIONS:', destination.hash);
      dispatch({
        type: 'SET_TOKTOKGO_BOOKING_DETAILS',
        payload: {...details, paymentMethod: 'TOKTOKWALLET'},
      });
      if (!destination?.place?.formattedAddress) {
        navigation.pop();
        dispatch({type: 'SET_TOKTOKGO_BOOKING_DETAILS', payload: {...details, noteToDriver: notes.text}});
        navigation.push('ToktokGoBookingSelectLocations', {
          popTo: 1,
        });
      } else {
        getQuotation({
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
        });
      }
    },
    1000,
    {trailing: false},
  );
  const [getPlaceByLocation, {loading: GPBLloading}] = useLazyQuery(GET_PLACE_BY_LOCATION, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload: response.getPlaceByLocation});
      setFakeLoading(false);
    },
    onError: onError,
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

  useEffect(() => {
    if (!origin?.place?.location.latitude) {
      const payload = {
        hash: defaultAddress.placeHash,
        name: defaultAddress.contactDetails.fullname,
        place: defaultAddress.place,
      };
      dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload});
    }
  }, []);

  const onDragEndMarker = e => {
    if (!initialRegionChange) {
      setMapRegion(e);
      debouncedRequest(e);
    }
    setInitialRegionChange(false);
  };
  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <AlertOverlay visible={loading} />
      <ThrottledOpacity delay={500} style={styles.backButton} onPress={() => navigation.pop()}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </ThrottledOpacity>
      {origin?.place?.location?.latitude && (
        <Pickup
          onDragEndMarker={onDragEndMarker}
          mapRegion={mapRegion}
          loading={GPBLloading}
          fakeLoading={fakeLoading}
          setFakeLoading={setFakeLoading}
        />
      )}
      <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : null} style={styles.card}>
        <NotesToDriver
          dropDownRef={dropDownRef}
          navigation={navigation}
          popTo={popTo}
          note={note}
          setNote={setNote}
          notesToDriver={notesToDriver}
          notes={notes}
          loading={fakeLoading}
        />
        <ConfirmPickupButton onConfirm={onConfirm} />
      </KeyboardAvoidingView>
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
