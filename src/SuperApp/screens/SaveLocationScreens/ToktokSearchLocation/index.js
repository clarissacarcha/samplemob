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
import {ThrottledOpacity} from '../../../../components_section';

import CONSTANTS from '../../../../common/res/constants';

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

  return (
    <View style={styles.container}>
      <View style={{position: 'absolute', flex: 1, top: 16}}>
        <View style={styles.addressBox}>
          <View style={styles.searchContainer}>
            <Image source={SearchICN} resizeMode={'contain'} style={{width: 17, height: 17, marginLeft: 16}} />
            <TextInput
              numberOfLines={1}
              ref={inputRef}
              // editable={!GPLLoading && !disableAddressBox}
              value={getSearchedValue()}
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
                <Image
                  source={ClearTextInput}
                  style={{height: 17, width: 17, marginRight: 16}}
                  resizeMode={'contain'}
                />
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
    </View>
  );
};

export default ToktokSearchLocation;

const styles = StyleSheet.create({
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
