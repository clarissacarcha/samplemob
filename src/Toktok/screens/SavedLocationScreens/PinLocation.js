import React, {useState, useRef} from 'react';
import {View, TextInput, StyleSheet, ActivityIndicator, FlatList, Image, Text, Dimensions} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {HeaderBack, HeaderTitle} from '../../../components';
import {DARK} from '../../../res/constants';
import CONSTANTS from '../../../common/res/constants';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {GET_PLACE_AUTOCOMPLETE, GET_PLACE_BY_ID, GET_PLACE_BY_LOCATION} from '../../../ToktokGo/graphql';
import {POST_NEW_ADDRESS, TOKTOK_ADDRESS_CLIENT} from '../../../graphql';
import {TOKTOK_QUOTATION_GRAPHQL_CLIENT} from 'src/graphql';
import uuid from 'react-native-uuid';
import {useDebounce} from '../../../ToktokGo/helpers';
import {currentLocation} from '../../../helper';

import GpsDenied from '../../../assets/images/GpsDenied.png';
import PinLocationIcon from '../../../assets/images/locationIcon.png';
import {ThrottledOpacity} from '../../../components_section';
import SearchICN from '../../../assets/images/SearchIcon.png';
import ClearTextInput from '../../../assets/icons/EraseTextInput.png';
import {MAP_DELTA_LOW} from '../../../res/constants';
import {onError} from '../../../util/ErrorUtility';
import {SuccesOperationAddressModal} from './Components';

const FULL_WIDTH = Dimensions.get('window').width;

const PinLocation = ({navigation, route}) => {
  const mapRef = useRef(null);
  const inputRef = useRef();
  const sessionToken = uuid.v4();
  const {isFromLocationAccess, locCoordinates, setConfirmedLocation, addressObj, setIsEdited} = route.params;

  const [initialCoord, setInitialCoord] = useState(locCoordinates?.latitude ? locCoordinates : {});
  const [disableAddressBox, setDisableAddressBox] = useState(true);
  const [searchedData, setSearchedData] = useState('');
  const [searchedText, setSearchedText] = useState('');
  const [searchedLocation, setSearchedLocation] = useState({});
  const [showSuccessOperationAddressModal, setShowSuccessOperationAddressModal] = useState(false);

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['PIN', 'Location']} />,
  });

  const [getPlaceAutocomplete, {loading}] = useLazyQuery(GET_PLACE_AUTOCOMPLETE, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setSearchedData(response.getPlaceAutocomplete);
    },
    onError: onError,
  });

  const [getPlaceById] = useLazyQuery(GET_PLACE_BY_ID, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      mapRef.current.animateToRegion(
        {
          latitude: response.getPlaceById.place.location.latitude,
          longitude: response.getPlaceById.place.location.longitude,
          ...MAP_DELTA_LOW,
        },
        350,
      );
      setSearchedLocation(response.getPlaceById);
      setSearchedData(null);
    },
    onError: onError,
  });

  const [getPlaceByLocation, {data, loading: GPLLoading}] = useLazyQuery(GET_PLACE_BY_LOCATION, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setSearchedLocation(response.getPlaceByLocation);
      setSearchedText(response.getPlaceByLocation.place.formattedAddress);
      setDisableAddressBox(false);
    },
    onError: onError,
  });

  const [postNewAddress, {loading: PNALoading}] = useMutation(POST_NEW_ADDRESS, {
    client: TOKTOK_ADDRESS_CLIENT,
    onCompleted: () => {
      setShowSuccessOperationAddressModal(true);
    },
    onError: onError,
  });

  const debouncedRequest = useDebounce(
    value =>
      getPlaceAutocomplete({
        variables: {
          input: {
            searchString: value,
            sessionToken: sessionToken,
          },
        },
      }),
    1000,
  );

  const getPlace = item => {
    setSearchedText(item.formattedAddress);

    getPlaceById({
      variables: {
        input: {
          sessionToken: sessionToken,
          placeId: item.placeId,
          formattedAddress: item.formattedAddress,
        },
      },
    });
  };

  const onMapDrag = useDebounce(
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

  const saveDefaultAddress = () => {
    postNewAddress({
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
        },
      },
    });
  };

  const goToHome = () => {
    setShowSuccessOperationAddressModal(false);
    navigation.push('ConsumerLanding');
  };

  const onChange = value => {
    debouncedRequest(value);
    setSearchedText(value);
  };

  const onSubmit = () => {
    if (isFromLocationAccess) {
      saveDefaultAddress();
      return;
    }
    if (addressObj) {
      setIsEdited(true);
    }
    setConfirmedLocation(searchedLocation);
    navigation.pop();
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
        showsUserLocation={true}
        onRegionChangeComplete={e => {
          onMapDrag(e);
        }}
      />
      {/*---------------------------------------- ADDRESS BOX ----------------------------------------*/}
      <View style={{position: 'absolute', width: '100%', top: 16}}>
        <View style={styles.addressBox}>
          <Image source={SearchICN} resizeMode={'contain'} style={{width: 20, height: 20, marginLeft: 16}} />
          <TextInput
            numberOfLines={1}
            ref={inputRef}
            editable={!GPLLoading && !disableAddressBox}
            value={searchedText}
            onChangeText={onChange}
            style={styles.input}
          />
          {loading || GPLLoading ? (
            <ActivityIndicator color={CONSTANTS.COLOR.ORANGE} style={{height: 20, width: 20, marginRight: 16}} />
          ) : searchedText ? (
            <ThrottledOpacity disabled={GPLLoading} delay={4000} onPress={clearSearhedData}>
              <Image source={ClearTextInput} style={{height: 20, width: 20, marginRight: 16}} resizeMode={'contain'} />
            </ThrottledOpacity>
          ) : null}
        </View>

        <FlatList
          style={{
            marginHorizontal: 16,
            borderBottomLeftRadius: 5,
          }}
          showsVerticalScrollIndicator={false}
          data={searchedData}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            const lastItem = index == searchedData.length - 1 ? true : false;
            return (
              <View style={styles.lastSearchedItem}>
                <ThrottledOpacity delay={4000} onPress={() => getPlace(item)}>
                  <View style={[styles.searchedAddresses, lastItem && styles.lastSearchedItem]}>
                    <Text style={{color: CONSTANTS.COLOR.GRAY}}>{item.formattedAddress}</Text>
                  </View>
                  {!lastItem && (
                    <View
                      style={{borderBottomColor: CONSTANTS.COLOR.LIGHT, borderBottomWidth: 1, marginHorizontal: 0}}
                    />
                  )}
                </ThrottledOpacity>
              </View>
            );
          }}
        />
      </View>
      <View style={{alignItems: 'center', zIndex: 999, alignContent: 'center', position: 'absolute'}}>
        <Image
          source={PinLocationIcon}
          style={{height: 36, width: 36, marginTop: -26, zIndex: 1000}}
          resizeMode={'contain'}
        />
      </View>
      {/*---------------------------------------- BUTTON ----------------------------------------*/}

      <View style={styles.submitContainer}>
        <ThrottledOpacity disabled={data ? false : true} delay={4000} onPress={onSubmit} style={{borderRadius: 10}}>
          <View style={styles.submit}>
            <Text style={styles.submitText}>Confirm</Text>
          </View>
        </ThrottledOpacity>
      </View>
    </View>
  );
};

export default PinLocation;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 50,
    marginHorizontal: 16,
    alignItems: 'center',
    paddingHorizontal: 8,
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

  submitBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    margin: 16,
    borderRadius: 5,
  },
  input: {
    width: '80%',
    padding: 16,
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  submitText: {
    color: CONSTANTS.COLOR.WHITE,
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  submit: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    height: 50,
    borderRadius: 10,
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
});
