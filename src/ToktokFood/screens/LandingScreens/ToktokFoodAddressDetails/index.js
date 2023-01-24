import axios from 'axios';
import {debounce} from 'lodash';
import uuid from 'react-native-uuid';
import {useLazyQuery} from '@apollo/react-hooks';
import {PROTOCOL, HOST_PORT} from 'res/constants';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import React, {useReducer, useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import StyledText from 'toktokfood/components/StyledText';

import {useNavigation} from '@react-navigation/native';

import {FONT, FONT_SIZE, COLOR} from 'res/variables';
import {GET_GOOGLE_PLACE_DETAILS, PREF_GET_SAVED_ADDRESSES, TOKTOK_ADDRESS_CLIENT} from '../../../../graphql';
import ContentLoader from 'react-native-easy-content-loader';

import {useSelector} from 'react-redux';

// Utils
import {verticalScale, getStatusbarHeight, moderateScale, getDeviceWidth} from 'toktokfood/helper/scale';
import {empty_search_2} from '../../../assets/images';
import {BackButton} from '../../../../components_section/Buttons';
import {HeaderTitle} from '../../../../components_section/Texts';
import CONSTANTS from '../../../../common/res/constants';
import {ThrottledHighlight, ThrottledOpacity} from '../../../../components_section';
import ClearTextInput from '../../../../assets/icons/EraseTextInput.png';
import DestinationIcon from '../../../../assets/icons/DestinationIcon.png';
import FIcons from 'react-native-vector-icons/Fontisto';
import {SearchDisplayCard} from './sections/SearchDisplayCard';
import AsyncStorage from '@react-native-community/async-storage';
import {RecentSearch} from './sections/RecentSearch';
import {onError} from '../../../../util/ErrorUtility';
import {SavedAddress} from './sections/SavedAddress';
import SearchBar from './sections/SearchBar';

const initialPickUpDetails = {
  pickUpAddress: '',
  contactPerson: '',
  contactPersonNumber: '',
  pickUpCompleteAddress: '',
  pickUpAddressLatLong: {},
  loading: false,
};

const ToktokFoodAddressDetails = ({route}) => {
  const navigation = useNavigation();

  navigation.setOptions({
    headerLeft: () => <BackButton navigation={navigation} />,
    headerTitle: () => <HeaderTitle label={'Address'} />,
  });

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
      case 'SET_LOADING':
        return {...state, loading: action.value};
    }
  };

  const [state, dispatch] = useReducer(reducer, initialPickUpDetails);

  const onSearchMapNavigate = ({latitude, longitude, address}) => {
    navigation.replace('ToktokFoodMapSearch', {
      coordinates: {
        latitude,
        longitude,
      },
      address: address,
      isCart: route.params?.isCart,
      cartRefetch: route.params?.cartRefetch,
    });
  };

  const [addressList, setAddressList] = useState([]);
  const [sessionToken, setSessionToken] = useState(uuid.v4());
  const [searchValue, setSearchValue] = useState('');
  const [recentSearchDataList, setRecentSearchDataList] = useState([]);
  const [savedAddressList, setSavedAddressList] = useState([]);
  const [addressObj, setAddressObj] = useState(null);

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
      dispatch({type: 'SET_LOADING', value: false});
      if (payload.success) {
        setAddressList(predictions);
        setSessionToken(uuid.v4());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedGetGooglePlaceAutocomplete = useDebounce(() => {
    getGooglePlaceAutocomplete(searchValue);
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
      const response = {
        place: {
          location: data.getGooglePlaceDetails.location,
          formattedAddress: state.pickUpCompleteAddress,
          addressBreakdown: data.getGooglePlaceDetails.addressBreakdown,
        },
      };
      addItemToList(response);
      onSearchMapNavigate({latitude, longitude, address: state.pickUpCompleteAddress});
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

  const onSelectPresetAddresses = item => {
    const {latitude, longitude} = item.place.location;
    const fullAddress = item.place.formattedAddress;
    dispatch({
      type: 'SET_PICKUP_ADDRESS_COORDINATES',
      value: {
        latitude: latitude,
        longitude: longitude,
      },
    });
    dispatch({
      type: 'SET_PICKUP_COMPLETE_ADDRESS',
      value: fullAddress,
    });
    onSearchMapNavigate({latitude, longitude, address: fullAddress});
  };

  const renderLoader = () => {
    if (state.pickUpAddress !== '' && !state.loading) {
      return (
        <View style={styles.emptyList}>
          <Image source={empty_search_2} style={styles.emptyImage} />
          <StyledText mode="semibold" fontSize={18} style={{color: COLOR.ORANGE}}>
            No Result Found
          </StyledText>
          <StyledText style={{marginTop: 8}}>Try to search something similar.</StyledText>
        </View>
      );
    } else if (state.pickUpAddress !== '' && state.loading) {
      return (
        <>
          {[1, 2, 3, 4, 5].map(v => (
            <View key={v}>
              <View style={styles.placeItem}>
                <View style={styles.iconLoader} />
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

  const onPressSearch = () => {
    if (state.pickUpAddress !== searchValue) {
      dispatch({type: 'SET_LOADING', value: true});
      dispatch({type: 'SET_PICKUP_ADDRESS', value: searchValue});
      debouncedGetGooglePlaceAutocomplete();
    }
  };

  const onPressSearchedAddress = item => {
    const formattedAddressParts = item.formattedAddress.split(',');
    onResultSelect(item, formattedAddressParts.toString());
  };

  const getSearchList = async () => {
    try {
      const data = await AsyncStorage.getItem('recentFoodSearchList');

      const output = JSON.parse(data);
      console.log(output);
      if (output != null) {
        setRecentSearchDataList(output);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [getSavedAddress] = useLazyQuery(PREF_GET_SAVED_ADDRESSES, {
    client: TOKTOK_ADDRESS_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setSavedAddressList(response.prefGetSavedAddresses);
    },
    onError: onError,
  });

  const addItemToList = async response => {
    try {
      const data = await AsyncStorage.getItem('recentFoodSearchList');
      if (data === null) {
        const searchList = JSON.stringify([response]);

        await AsyncStorage.setItem('recentFoodSearchList', searchList);
      } else {
        const recentList = JSON.parse(data);
        if (recentList.length >= 3) {
          let obj = recentList.find(o => o.place.formattedAddress === response.place.formattedAddress);
          if (obj !== undefined) {
            console.log('SameAddress');
          } else {
            setRecentSearchDataList([]);
            const removedItem = recentList.slice(0, 2);
            removedItem.unshift(response);
            const searchList = JSON.stringify(removedItem);
            await AsyncStorage.setItem('recentFoodSearchList', searchList);
          }
        } else {
          let obj = recentList.find(o => o.place.formattedAddress === response.place.formattedAddress);
          if (obj !== undefined) {
            console.log('SameAddress');
          } else {
            recentSearchDataList.push(response);
            const searchList = JSON.stringify(recentSearchDataList);
            await AsyncStorage.setItem('recentFoodSearchList', searchList);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (addressObj) {
      onSelectPresetAddresses(addressObj);
    }
  }, [addressObj]);

  const getAddressObj = address => {
    setAddressObj(address);
  };

  const navigateToSavedAddress = () => {
    navigation.push('ToktokSavedLocations', {getAddressObj});
  };

  useEffect(() => {
    getSearchList();
    getSavedAddress();
  }, []);

  useEffect(() => {
    state.pickUpAddress !== '' ? debouncedGetGooglePlaceAutocomplete() : setAddressList([]);
  }, [state.pickUpAddress]);

  const emptyList = () => {
    if (state.pickUpAddress !== '' && !state.loading) {
      return (
        <View style={styles.emptyList}>
          <Image source={empty_search_2} style={styles.emptyImage} />
          <StyledText mode="semibold" fontSize={18} style={{color: COLOR.ORANGE}}>
            No Result Found
          </StyledText>
          <StyledText style={{marginTop: 8}}>Try to search something similar.</StyledText>
        </View>
      );
    }

    if (state.pickUpAddress !== '' && state.loading) {
      return (
        <>
          {[1, 2, 3, 4, 5].map(v => (
            <View key={v}>
              <View style={styles.placeItem}>
                <View style={styles.iconLoader} />
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
    }

    return (
      <>
        {recentSearchDataList.length > 0 && addressList.length === 0 && !state.loading && (
          <RecentSearch
            recentSearchDataList={recentSearchDataList}
            onPressRecentSearch={onSelectPresetAddresses}
            navigation={navigation}
            getSavedAddress={getSavedAddress}
          />
        )}
        {savedAddressList.length > 0 && addressList.length === 0 && !state.loading && (
          <SavedAddress
            recentSearchDataList={recentSearchDataList}
            savedAddressList={savedAddressList}
            navigation={navigation}
            navigateToSavedAddress={navigateToSavedAddress}
            onPressSavedAddress={onSelectPresetAddresses}
            getSavedAddress={getSavedAddress}
          />
        )}
      </>
    );
  };

  return (
    <View style={{backgroundColor: CONSTANTS.COLOR.WHITE, flex: 1, justifyContent: 'space-between'}}>
      <FlatList
        ListHeaderComponent={
          <SearchBar
            onPressSearch={onPressSearch}
            searchValue={searchValue}
            setAddressList={setAddressList}
            setSearchValue={setSearchValue}
            dispatch={dispatch}
          />
        }
        showsVerticalScrollIndicator={false}
        data={addressList}
        ListEmptyComponent={emptyList}
        keyExtractor={(item, index) => index}
        renderItem={({item, index}) => <SearchDisplayCard item={item} onSelectPlace={onPressSearchedAddress} />}
      />
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}

      {/* {savedAddressList.length > 0 && addressList.length === 0 && !state.loading && (
          <SavedAddress
            recentSearchDataList={recentSearchDataList}
            savedAddressList={savedAddressList}
            navigation={navigation}
            navigateToSavedAddress={navigateToSavedAddress}
            onPressSavedAddress={onSelectPresetAddresses}
          />
        )} */}
      <ThrottledHighlight
        delay={500}
        onPress={() => {
          onSearchMapNavigate(location);
        }}>
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
  emptyList: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('screen').height * 0.75,
  },
  emptyImage: {
    width: 215,
    height: 180,
    marginBottom: 16,
  },
  containerInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
  },
  input: {
    marginLeft: 12,
    color: CONSTANTS.COLOR.BLACK,
    width: '75%',
    paddingVertical: 12,
  },
});

export default ToktokFoodAddressDetails;
