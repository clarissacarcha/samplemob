import axios from 'axios';
import {debounce} from 'lodash';
import uuid from 'react-native-uuid';
import {useLazyQuery} from '@apollo/react-hooks';
import {PROTOCOL, HOST_PORT} from 'res/constants';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import React, {useReducer, useState, useEffect, useRef, useCallback} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, FlatList} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {FONT, FONT_SIZE, COLOR} from 'res/variables';
import {GET_GOOGLE_PLACE_DETAILS} from '../../../../graphql';
import ContentLoader from 'react-native-easy-content-loader';

import {useSelector} from 'react-redux';

// Utils
import {verticalScale, getStatusbarHeight, moderateScale, getDeviceWidth} from 'toktokfood/helper/scale';

const initialPickUpDetails = {
  pickUpAddress: '',
  contactPerson: '',
  contactPersonNumber: '',
  pickUpCompleteAddress: '',
  pickUpAddressLatLong: {},
};

const ToktokFoodAddressDetails = ({route}) => {
  const navigation = useNavigation();

  const {location} = useSelector(state => state.toktokFood);

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_PICKUP_ADDRESS':
        return {...state, pickUpAddress: action.value};
      case 'SET_PICKUP_ADDRESS_COORDINATES':
        return {...state, pickUpAddressLatLong: action.value};
      case 'SET_PICKUP_COMPLETE_ADDRESS':
        return {...state, pickUpCompleteAddress: action.value};
      case 'SET_PICKUP_CONTACT_NAME':
        return {...state, contactPerson: action.value};
      case 'SET_PICKUP_CONTACT_NUMBER':
        return {...state, contactPersonNumber: action.value};
    }
  };

  const [state, dispatch] = useReducer(reducer, initialPickUpDetails);

  const onSearchMapNavigate = c => {
    if (typeof c === 'object') {
      navigation.replace('ToktokFoodMapSearch', {
        coordinates: c,
        address: state.pickUpCompleteAddress,
        isCart: route.params?.isCart,
      });
    }
  };

  const [addressList, setAddressList] = useState([]);
  const [sessionToken, setSessionToken] = useState(uuid.v4());

  const useIsMounted = () => {
    const isMountedRef = useRef(true);
    useEffect(() => {
      return () => {
        isMountedRef.current = false;
      };
    }, []);
    return () => isMountedRef.current;
  };

  const useDebounce = (cb, delay) => {
    const options = {
      leading: false,
      trailing: true,
    };
    const inputsRef = useRef(cb);
    const isMounted = useIsMounted();
    useEffect(() => {
      inputsRef.current = {cb, delay};
    });

    return useCallback(
      debounce(
        (...args) => {
          // Don't execute callback, if (1) component in the meanwhile
          // has been unmounted or (2) delay has changed
          if (inputsRef.current.delay === delay && isMounted()) inputsRef.current.cb(...args);
        },
        delay,
        options,
      ),
      [delay, debounce],
    );
  };

  const getGooglePlaceAutocomplete = async searchString => {
    try {
      const API_RESULT = await axios({
        url: `${PROTOCOL}://${HOST_PORT}/graphql`,
        method: 'post',
        data: {
          query: `
            query {
              getGooglePlaceAutocomplete(input:{
                searchString: "${searchString}"
                sessionToken:"${sessionToken}"
              }) {
                payload
                predictions {
                  formattedAddress
                  placeId
                }
              }
            }
          `,
        },
      });
      const {payload, predictions} = API_RESULT?.data.data?.getGooglePlaceAutocomplete;
      if (payload.success) {
        setAddressList(predictions);
        setSessionToken(uuid.v4());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedGetGooglePlaceAutocomplete = useDebounce(() => {
    getGooglePlaceAutocomplete(state.pickUpAddress);
  }, 800);

  const [getGooglePlaceDetails] = useLazyQuery(GET_GOOGLE_PLACE_DETAILS, {
    fetchPolicy: 'network-only',
    onCompleted: data => {
      const {latitude, longitude} = data.getGooglePlaceDetails.location;
      dispatch({
        type: 'SET_PICKUP_ADDRESS_COORDINATES',
        value: {
          latitude: latitude,
          longitude: longitude,
        },
      });
      onSearchMapNavigate({latitude, longitude});
      setSessionToken(uuid.v4());
    },
  });

  const onResultSelect = (prediction, fullAddress) => {
    dispatch({
      type: 'SET_PICKUP_COMPLETE_ADDRESS',
      value: fullAddress,
    });

    getGooglePlaceDetails({
      variables: {
        input: {
          placeId: prediction.placeId,
          sessionToken: sessionToken,
        },
      },
    });
  };

  const renderLoader = () => {
    if (state.pickUpAddress !== '') {
      return (
        <>
          {[1, 2, 3, 4, 5].map((v) => (
            <View key={v}>
              <View style={styles.placeItem}>
                <View style={styles.iconLoader}></View>
                <View style={{flex: 1}}>
                  <View style={{width: '100%'}}>
                    <ContentLoader
                      active
                      pRows={2}
                      pWidth={['40%', '80%']}
                      title={false}
                      primaryColor="#FFFFFF"
                      secondaryColor="rgba(256,186,28,0.4)"
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </>
      );
    } else {
      return <></>;
    }
  };

  const renderItem = ({item}) => {
    const formattedAddressParts = item.formattedAddress.split(',');
    if (formattedAddressParts[0].indexOf('Undefined') === -1) {
      return (
        <>
          <TouchableWithoutFeedback onPress={() => onResultSelect(item, formattedAddressParts.toString())}>
            <View style={styles.placeItem}>
              <MIcon style={styles.placeIcon} name="place" size={27} color={COLOR.ORANGE} />
              <View style={styles.addressContainer}>
                <Text numberOfLines={1} style={styles.placeName}>
                  {formattedAddressParts[0]}
                </Text>
                <Text style={styles.placeAddress} numberOfLines={1}>
                  {formattedAddressParts}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </>
      );
    } else {
      <></>;
    }
  };

  // useEffect(() => {
  //   dispatch({type: 'SET_PICKUP_ADDRESS', value: location.address});
  // }, []);

  useEffect(() => {
    state.pickUpAddress !== '' ? debouncedGetGooglePlaceAutocomplete() : setAddressList([]);
  }, [state.pickUpAddress]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchBoxWrapper}>
          <View style={styles.searchBoxContainer}>
            <View style={[styles.textInputWrapper, styles.searchBoxShadow]}>
              <MIcon
                onPress={() => navigation.pop()}
                style={styles.searchBoxIcon}
                name="chevron-left"
                size={32}
                color={COLOR.ORANGE}
              />
              <TextInput
                autoFocus={true}
                multiline={false}
                value={state.pickUpAddress}
                placeholder="Enter Location"
                style={[styles.searchBox, styles.textInputFontStyles]}
                onFocus={() => debouncedGetGooglePlaceAutocomplete()}
                onChangeText={query => dispatch({type: 'SET_PICKUP_ADDRESS', value: query})}
              />
              <MIcon
                onPress={() => dispatch({type: 'SET_PICKUP_ADDRESS', value: ''})}
                style={styles.closeBoxIcon}
                name="close"
                size={22}
                color={COLOR.DARK}
              />
            </View>
          </View>
        </View>

        <View style={styles.placeListContainer}>
          <FlatList
            data={addressList}
            ListEmptyComponent={renderLoader}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  searchBoxWrapper: {
    marginTop: verticalScale(getStatusbarHeight + 7),
  },
  searchBoxContainer: {
    width: getDeviceWidth,
    alignItems: 'center',
  },
  searchBox: {
    height: 49,
    width: '100%',
    borderRadius: 13,
    paddingHorizontal: 38,
    backgroundColor: '#FFF',
  },
  searchBoxShadow: {
    shadowColor: '#949494',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInputFontStyles: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.REGULAR,
  },
  textInputWrapper: {
    height: 50,
    width: '93%',
    display: 'flex',
    borderRadius: 13,
    position: 'relative',
    flexDirection: 'row',
  },
  searchBoxIcon: {
    left: 5,
    zIndex: 99,
    alignSelf: 'center',
    position: 'absolute',
  },
  closeBoxIcon: {
    right: 10,
    zIndex: 99,
    alignSelf: 'center',
    position: 'absolute',
  },
  placeListContainer: {
    flex: 1,
    paddingTop: 12,
  },
  placeItem: {
    height: 57,
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: COLOR.LIGHT,
    paddingHorizontal: moderateScale(16),
  },
  addressContainer: {
    paddingEnd: 12,
  },
  placeIcon: {
    marginEnd: 4,
  },
  placeName: {
    marginBottom: 3,
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  placeAddress: {
    maxWidth: '98%',
    color: COLOR.DARK,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  iconLoader: {
    width: 25,
    height: 25,
    borderRadius: 50,
    backgroundColor: 'rgba(256,186,28,0.4)',
  },
});

export default ToktokFoodAddressDetails;
