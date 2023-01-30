import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  Dimensions,
  BackHandler,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {HeaderBack, HeaderTitle} from '../../../../components';
import {DARK} from '../../../../res/constants';
import CONSTANTS from '../../../../common/res/constants';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {GET_PLACE_BY_LOCATION} from '../../../../ToktokGo/graphql';
import {PREF_GET_SAVED_ADDRESSES, PREF_USER_ADDRESS_CREATE, TOKTOK_ADDRESS_CLIENT} from '../../../../graphql';
import {TOKTOK_QUOTATION_GRAPHQL_CLIENT} from 'src/graphql';
import {currentLocation} from '../../../../helper';
import LottieView from 'lottie-react-native';

import GpsDenied from '../../../../assets/images/GpsDenied.png';
import PinLocationIcon from '../../../../assets/images/locationIcon.png';
import {ThrottledOpacity} from '../../../../components_section';
import {MAP_DELTA_LOW} from '../../../../res/constants';
import {onError} from '../../../../util/ErrorUtility';
import {SuccesOperationAddressModal} from '../Components';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import DestinationIcon from '../../../../assets/icons/DestinationIcon.png';
import LinearGradient from 'react-native-linear-gradient';

const FULL_WIDTH = Dimensions.get('window').width;
const lottieLoading = require('../../../../assets/JSON/loader.json');

const ToktokPinLocation = ({navigation, route}) => {
  const mapRef = useRef(null);
  const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
  const {
    initialCoordinates,
    searchedLocationFromPrevScreen,
    isFromLocationAccess = false,
    setConfirmedLocation = () => {},
    addressObj,
    setIsEdited,
    setErrorAddressField,
    popTo,
  } = route.params;

  const [initialCoord, setInitialCoord] = useState(initialCoordinates);
  const [searchedLocation, setSearchedLocation] = useState(searchedLocationFromPrevScreen);
  const [mapDragCoords, setMapDragCoords] = useState(initialCoordinates);
  const [showSuccessOperationAddressModal, setShowSuccessOperationAddressModal] = useState(false);
  const [showConfirmLocButton, setShowConfirmLocButton] = useState(false);
  const [toggleLabelUpdateLocButton, setToggleLabelUpdateLocButton] = useState(true);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  navigation.setOptions({
    headerLeft: () => (
      <HeaderBack
        onBack={() => {
          navigation.pop(popTo ? popTo : 1);
        }}
      />
    ),
    headerTitle: () => <HeaderTitle label={['Address']} />,
  });

  const [getPlaceByLocation, {data, loading: GPLLoading}] = useLazyQuery(GET_PLACE_BY_LOCATION, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setSearchedLocation(response.getPlaceByLocation);
    },
    onError: onError,
  });

  const [prefUserAddressCreate, {loading: PNALoading}] = useMutation(PREF_USER_ADDRESS_CREATE, {
    client: TOKTOK_ADDRESS_CLIENT,
    onCompleted: () => {
      setShowSuccessOperationAddressModal(true);
    },
    onError: onError,
  });

  const [prefGetSavedAddresses, {data: AddressesData}] = useLazyQuery(PREF_GET_SAVED_ADDRESSES, {
    client: TOKTOK_ADDRESS_CLIENT,
    fetchPolicy: 'network-only',
    onError: onError,
  });

  const onMapDrag = value => {
    if (counter > 0) {
      setToggleLabelUpdateLocButton(true);
      setShowConfirmLocButton(true);
    } else {
      setToggleLabelUpdateLocButton(false);
    }
    setCounter(prev => prev + 1);

    setMapDragCoords(value);
  };

  const saveDefaultAddress = () => {
    prefUserAddressCreate({
      variables: {
        input: {
          isHome: true,
          isOffice: false,
          label: '',
          isDefault: true,
          landmark: '',
          placeHash: data?.getPlaceByLocation?.hash,
          contactDetails: {
            fullname: '',
            mobile_no: '',
          },
          // temporary fixed data
          isFirstAddress: false,
          addressComponents: {
            regCode: '1561',
            regDesc: 'waxcxzc',
            provCode: '5461',
            provDesc: 'daszxczxczxc',
            citymunCode: '321654',
            citymunDesc: 'cvvxvcxvc',
          },
        },
      },
    });
  };

  useEffect(() => {
    if (!searchedLocation) {
      getCurrentLocation();
    }
    prefGetSavedAddresses();

    BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.pop(popTo ? popTo : 1);
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress');
    };
  }, []);

  const goToHome = () => {
    setShowSuccessOperationAddressModal(false);
    navigation.pop();
    navigation.replace('ConsumerLanding');
  };

  const onConfirmLoc = () => {
    if (toggleLabelUpdateLocButton) {
      setFakeLoading(true);
      getPlaceByLocation({
        variables: {
          input: {
            location: {
              latitude: mapDragCoords.latitude,
              longitude: mapDragCoords.longitude,
            },
            service: 'PREF',
          },
        },
      });
      setToggleLabelUpdateLocButton(false);
      setTimeout(() => {
        setShowConfirmLocButton(false);
        setFakeLoading(false);
      }, 1500);
    }
  };

  const onSubmit = () => {
    if (AddressesData?.prefGetSavedAddresses.length < 1 && !isFromLocationAccess) {
      saveDefaultAddress();
      return;
    }
    if (addressObj) {
      setIsEdited(true);
    }
    setConfirmedLocation(searchedLocation);
    setErrorAddressField(false);
    navigation.pop(2);
  };

  const clearSearhedData = () => {
    setSearchedText('');
    setSearchedData(null);
  };

  const getCurrentLocation = async () => {
    const {latitude, longitude} = await currentLocation({showsReverseGeocode: false});
    setInitialCoord({
      latitude: latitude,
      longitude: longitude,
      ...MAP_DELTA_LOW,
    });
    getPlaceByLocation({
      variables: {
        input: {
          location: {
            latitude: latitude,
            longitude: longitude,
          },
          service: 'PREF',
        },
      },
    });
  };

  const getSearchedValue = () => {
    if (searchedText.length >= 40) {
      if (FULL_WIDTH < 380) {
        return searchedText.substring(0, 36) + '...';
      } else {
        return searchedText.substring(0, 40) + '...';
      }
    } else {
      return searchedText;
    }
  };

  if (!initialCoord?.latitude) {
    return (
      <View style={styles.container}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image source={GpsDenied} resizeMode={'contain'} style={styles.gpsDeniedDimensions} />
          <Text style={styles.gpsDeniedTitle}>Turn On Device Location</Text>
          <Text style={styles.gpsDeniedDesc}>
            Please turn on your device location. You can find it under your device Settings {`>`} Location.
          </Text>
          <ThrottledOpacity delay={4000} onPress={getCurrentLocation} style={styles.buttonWrapper}>
            <Text style={styles.buttonText}>Try Again</Text>
          </ThrottledOpacity>
        </View>
      </View>
    );
  }

  const getBottomAddress = () => {
    const addressSplit = searchedLocation?.place?.formattedAddress.split(',');
    addressSplit.splice(0, 1).join('');
    return addressSplit.join(',').trim();
  };

  return (
    <View style={styles.container}>
      <SuccesOperationAddressModal
        visible={showSuccessOperationAddressModal}
        onSubmit={goToHome}
        operationType={'CREATE'}
      />
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{height: '100%', width: '100%'}}
        initialRegion={initialCoord}
        onPanDrag={e => {
          setShowConfirmLocButton(false);
        }}
        onRegionChangeComplete={e => {
          onMapDrag(e);
        }}
      />
      <>
        {showConfirmLocButton && (
          <View style={styles.floatinButtonContainer}>
            <ThrottledOpacity
              onPress={onConfirmLoc}
              style={styles.floatingButton}
              delay={4000}
              disabled={!toggleLabelUpdateLocButton}>
              {!GPLLoading ? (
                <Text style={{color: 'white'}}>{toggleLabelUpdateLocButton ? 'Update Location' : 'Updated!'}</Text>
              ) : (
                <LottieView source={lottieLoading} autoPlay loop style={styles.loader} resizeMode="cover" />
              )}
            </ThrottledOpacity>
          </View>
        )}

        <View style={{alignItems: 'center', zIndex: 999, alignContent: 'center', position: 'absolute'}}>
          <Image
            source={PinLocationIcon}
            style={{height: 36, width: 36, marginTop: -26, zIndex: 1000}}
            resizeMode={'contain'}
          />
        </View>
      </>
      {/*---------------------------------------- BUTTON ----------------------------------------*/}

      <View style={styles.card}>
        <View
          style={{
            borderRadius: 5,
            backgroundColor: CONSTANTS.COLOR.LIGHT,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 10,
              marginVertical: 10,
              textAlign: 'center',
            }}>
            <Image source={DestinationIcon} style={{height: 20, width: 25, marginRight: 5}} resizeMode={'contain'} />
            <ShimmerPlaceHolder
              style={[{width: '90%', marginBottom: !fakeLoading ? 0 : 18}, fakeLoading ? {height: 30} : {}]}
              visible={!fakeLoading}>
              <Text
                style={{
                  fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
                  fontSize: CONSTANTS.FONT_SIZE.M,
                  color: CONSTANTS.COLOR.BLACK,
                }}>
                {searchedLocation?.place?.formattedAddress
                  ? `${searchedLocation?.place?.formattedAddress.split(',')[0].trim()}`
                  : ''}
              </Text>
              <Text
                style={{
                  fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
                  fontSize: CONSTANTS.FONT_SIZE.M,
                  color: CONSTANTS.COLOR.ALMOST_BLACK,
                  paddingRight: 30,
                }}>
                {searchedLocation?.place?.formattedAddress ? getBottomAddress() : ''}
              </Text>
            </ShimmerPlaceHolder>
          </View>
        </View>
        <View style={styles.submitContainer}>
          <ThrottledOpacity disabled={GPLLoading} delay={4000} onPress={onSubmit} style={{borderRadius: 5}}>
            <View style={styles.submit}>
              <Text style={styles.submitText}>Confirm</Text>
            </View>
          </ThrottledOpacity>
        </View>
      </View>
    </View>
  );
};

export default ToktokPinLocation;

const styles = StyleSheet.create({
  card: {
    right: -4.5,
    width: '102%',
    borderWidth: 4,
    borderTopColor: CONSTANTS.COLOR.ORANGE,
    borderLeftColor: CONSTANTS.COLOR.ORANGE,
    borderRightColor: CONSTANTS.COLOR.ORANGE,
    borderBottomColor: CONSTANTS.COLOR.WHITE,
    position: 'absolute',
    paddingTop: 13,
    paddingHorizontal: 16,
    bottom: 0,
    // zIndex: 999,
    backgroundColor: CONSTANTS.COLOR.WHITE,
    // marginTop: 8,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  container: {
    backgroundColor: 'white',
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressBox: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 8,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  submitBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    margin: 16,
    borderRadius: 5,
  },
  searchContainer: {
    width: '86%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  input: {
    width: '80%',
    paddingLeft: 16,
    height: 42,
    color: DARK,
  },
  searchedAddresses: {
    paddingLeft: 8,
    paddingVertical: 8,
    backgroundColor: CONSTANTS.COLOR.WHITE,
  },
  lastSearchedItem: {
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  submitContainer: {
    marginVertical: 16,
  },
  submitText: {
    color: CONSTANTS.COLOR.WHITE,
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  submit: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    paddingVertical: 11,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsDeniedDimensions: {
    height: FULL_WIDTH * 0.5,
    width: FULL_WIDTH * 0.5,
    marginBottom: 24,
  },
  gpsDeniedTitle: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    marginBottom: 8,
  },
  gpsDeniedDesc: {
    width: FULL_WIDTH * 0.6,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonWrapper: {
    width: FULL_WIDTH * 0.6,
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    paddingVertical: 11,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  floatingButton: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    padding: 7,
    borderRadius: 5,
    marginBottom: 100,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, .1)',
  },
  floatinButtonContainer: {
    position: 'absolute',
    zIndex: 999,
  },
  loader: {
    alignSelf: 'center',
    margin: -10,
    top: Platform.OS === 'ios' ? 6 : 4,
    width: 50,
    aspectRatio: 1.5,
  },
});
