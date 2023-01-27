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
import {DARK} from '../../../../res/constants';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {GET_PLACE_AUTOCOMPLETE, GET_PLACE_BY_ID, GET_PLACE_BY_LOCATION} from '../../../../ToktokGo/graphql';
import {PREF_GET_SAVED_ADDRESSES, PREF_USER_ADDRESS_CREATE, TOKTOK_ADDRESS_CLIENT} from '../../../../graphql';
import {TOKTOK_QUOTATION_GRAPHQL_CLIENT} from 'src/graphql';
import {HeaderBack, HeaderTitle} from '../../../../components';
import SearchICN from '../../../../assets/images/SearchIcon.png';
import {MAP_DELTA_LOW} from '../../../../res/constants';

import ClearTextInput from '../../../../assets/icons/EraseTextInput.png';
import FIcons from 'react-native-vector-icons/Fontisto';
import uuid from 'react-native-uuid';
import {onError} from '../../../../util/ErrorUtility';
import {ThrottledHighlight, ThrottledOpacity} from '../../../../components_section';
import DestinationIcon from '../../../../assets/icons/DestinationIcon.png';
import EmptySearch from '../../../../assets/images/empty-search.png';

import CONSTANTS from '../../../../common/res/constants';
import {currentLocation} from '../../../../helper';

const FULL_WIDTH = Dimensions.get('window').width;
const lottieLoading = require('../../../../assets/JSON/loader.json');

const ToktokSearchLocation = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Search', 'Address']} />,
  });
  const inputRef = useRef();
  const sessionToken = uuid.v4();

  const {
    isFromLocationAccess = false,
    locCoordinates,
    setLocCoordinates,
    formattedAddress,
    setConfirmedLocation,
    addressObj,
    setIsEdited,
    setErrorAddressField,
    popTo,
  } = route.params;
  const [searchedData, setSearchedData] = useState('');
  const [searchedText, setSearchedText] = useState('');

  const [getPlaceAutocomplete, {loading}] = useLazyQuery(GET_PLACE_AUTOCOMPLETE, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    onCompleted: response => {
      setSearchedData(response.getPlaceAutocomplete);
    },
    onError: onError,
  });

  const [prefGetSavedAddresses, {data: AddressesData}] = useLazyQuery(PREF_GET_SAVED_ADDRESSES, {
    client: TOKTOK_ADDRESS_CLIENT,
    fetchPolicy: 'network-only',
    onError: onError,
  });

  const [getPlaceById] = useLazyQuery(GET_PLACE_BY_ID, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      navigation.navigate('ToktokPinLocation', {
        initialCoordinates: {
          latitude: response.getPlaceById.place.location.latitude,
          longitude: response.getPlaceById.place.location.longitude,
          ...MAP_DELTA_LOW,
        },
        searchedLocationFromPrevScreen: response.getPlaceById,
        locCoordinates,
        setLocCoordinates,
        setConfirmedLocation,
        addressObj,
        setIsEdited,
        setErrorAddressField,
        isFromLocationAccess,
      });
      setSearchedData(null);
    },
    onError: onError,
  });

  const initiategetPlaceAutocomplete = () => {
    getPlaceAutocomplete({
      variables: {
        input: {
          searchString: searchedText,
          sessionToken: sessionToken,
        },
      },
    });
  };

  const getPlace = item => {
    setSearchedText(item.formattedAddress);

    getPlaceById({
      variables: {
        input: {
          sessionToken: sessionToken,
          placeId: item.placeId,
          formattedAddress: item.formattedAddress,
          service: 'PREF',
        },
      },
    });
  };

  const onChange = value => {
    // if (value.length >= 3) {
    //   debouncedRequest(value);
    // }
    setSearchedText(value);
  };

  const clearSearhedData = () => {
    setSearchedText('');
    setSearchedData(null);
  };

  useEffect(() => {
    prefGetSavedAddresses();
    // if (mapDragCoords.latitude) {
    //   getPlaceByLocation({
    //     variables: {
    //       input: {
    //         location: {
    //           latitude: mapDragCoords.latitude,
    //           longitude: mapDragCoords.longitude,
    //         },
    //         service: 'PREF',
    //       },
    //     },
    //   });
    // }

    BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.pop(popTo ? popTo : 1);
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress');
    };
  }, []);

  const onClickSelectViaMap = async () => {
    const {latitude, longitude} = await currentLocation({showsReverseGeocode: false});
    return navigation.navigate('ToktokPinLocation', {
      initialCoordinates: {
        latitude,
        longitude,
        ...MAP_DELTA_LOW,
      },
      locCoordinates,
      setLocCoordinates,
      setConfirmedLocation,
      addressObj,
      setIsEdited,
      setErrorAddressField,
      isFromLocationAccess,
    });
  };

  const emptyList = () => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 110}}>
        <Image source={EmptySearch} resizeMode={'contain'} style={{height: 200, width: 200}} />
        <Text
          style={{
            fontSize: CONSTANTS.FONT_SIZE.L,
            color: CONSTANTS.COLOR.ORANGE,
            fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
          }}>
          Search Location
        </Text>
        <Text
          style={{
            marginTop: 8,
            fontSize: CONSTANTS.FONT_SIZE.M,
            width: 200,
            textAlign: 'center',
          }}>
          Search a location or address that you want to save.
        </Text>
      </View>
    );
  };

  const listHeader = () => {
    return (
      <View style={styles.addressBox}>
        <View style={styles.searchContainer}>
          <Image source={SearchICN} resizeMode={'contain'} style={{width: 17, height: 17, marginLeft: 16}} />
          <TextInput
            numberOfLines={1}
            ref={inputRef}
            // editable={!GPLLoading && !disableAddressBox}
            placeholder={'Search'}
            value={searchedText}
            onChangeText={onChange}
            textAlign={'left'}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={initiategetPlaceAutocomplete}
          />
          {loading ? (
            <ActivityIndicator color={CONSTANTS.COLOR.ORANGE} style={{height: 17, width: 17, marginRight: 16}} />
          ) : searchedText ? (
            <ThrottledOpacity delay={4000} onPress={clearSearhedData}>
              <Image source={ClearTextInput} style={{height: 17, width: 17, marginRight: 16}} resizeMode={'contain'} />
            </ThrottledOpacity>
          ) : (
            <View style={{height: 17, width: 17, marginRight: 16}} />
          )}
        </View>
        <View>
          <ThrottledOpacity
            onPress={initiategetPlaceAutocomplete}
            style={{padding: 12, backgroundColor: CONSTANTS.COLOR.ORANGE, borderRadius: 5, marginLeft: 8}}>
            <FIcons name={'search'} size={18} color={CONSTANTS.COLOR.WHITE} />
          </ThrottledOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{
          marginHorizontal: 16,
          borderBottomLeftRadius: 5,
        }}
        showsVerticalScrollIndicator={false}
        data={searchedData}
        keyExtractor={item => item.id}
        ListHeaderComponent={listHeader()}
        ListEmptyComponent={emptyList()}
        renderItem={({item, index}) => {
          const lastItem = index == searchedData.length - 1 ? true : false;
          const addressParts = item.formattedAddress.split(',');
          return (
            <View style={styles.lastSearchedItem}>
              <ThrottledOpacity delay={4000} onPress={() => getPlace(item)}>
                <View style={[styles.searchedAddresses, lastItem && styles.lastSearchedItem]}>
                  <Text
                    style={{
                      color: CONSTANTS.COLOR.BLACK,
                      fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
                      fontSize: CONSTANTS.FONT_SIZE.M,
                    }}>{`${addressParts[0].trim()}, ${addressParts[1].trim()}`}</Text>
                  <Text
                    style={{
                      color: CONSTANTS.COLOR.ALMOST_BLACK,
                      fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
                      fontSize: CONSTANTS.FONT_SIZE.S,
                    }}>
                    {item.formattedAddress}
                  </Text>
                </View>
                {!lastItem && (
                  <View style={{borderBottomColor: CONSTANTS.COLOR.LIGHT, borderBottomWidth: 1, marginHorizontal: 0}} />
                )}
              </ThrottledOpacity>
            </View>
          );
        }}
      />
      <ThrottledHighlight delay={500} onPress={onClickSelectViaMap}>
        <View
          style={{
            paddingHorizontal: CONSTANTS.SIZE.MARGIN,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 16,
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowRadius: 5,
            shadowOpacity: 0.3,
            elevation: 10,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={DestinationIcon} style={{height: 20, width: 35, marginRight: 5}} resizeMode={'contain'} />
            <Text
              style={{
                color: CONSTANTS.COLOR.ORANGE,
                fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
                fontSize: CONSTANTS.FONT_SIZE.M,
              }}>
              Select via Map
            </Text>
          </View>
        </View>
      </ThrottledHighlight>
    </View>
  );
};

export default ToktokSearchLocation;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'space-between',
    flex: 1,
  },
  addressBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CONSTANTS.COLOR.MEDIUM_DARK,
    borderRadius: 5,
    shadowColor: '#000',
  },
  input: {
    marginLeft: 12,
    color: CONSTANTS.COLOR.BLACK,
    width: '75%',
    paddingVertical: 12,
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
    // height: 50,
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
