import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Text, View, TouchableHighlight, Image} from 'react-native';
import {
  Location,
  Header,
  FrequentlyUsed,
  SavedLocations,
  SearchLocation,
  OutsideServiceableArea,
  SavedAddress,
} from './Sections';
import CONSTANTS from '../../../common/res/constants';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {
  GET_PLACE_AUTOCOMPLETE,
  GET_PLACE_BY_ID,
  GET_PLACE_BY_LOCATION,
  GO_GET_TRIP_DESTINATIONS,
  GET_SAVED_ADDRESS,
} from '../../graphql';
import {TOKTOK_QUOTATION_GRAPHQL_CLIENT, TOKTOK_GO_GRAPHQL_CLIENT, TOKTOK_ADDRESS_CLIENT} from 'src/graphql';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import {throttle, debounce, get} from 'lodash';
import {connect, useDispatch, useSelector} from 'react-redux';
import {useDebounce} from '../../helpers';
import {EmptyRecent, ToktokgoBeta} from '../../components';
import DestinationIcon from '../../../assets/icons/DestinationIcon.png';
import DestinationBC from '../../../assets/toktokgo/destination4.png';
import {useFocusEffect} from '@react-navigation/native';
import {currentLocation} from '../../../helper';
import {ThrottledHighlight} from '../../../components_section';
import {onErrorAppSync, onError} from '../../util';
// import {onError} from '../../../util/ErrorUtility';
import {NoRecordFound, ServiceableArea} from './Components';
import AsyncStorage from '@react-native-community/async-storage';
import {useAlertGO} from '../../hooks';

const ToktokGoSelectedLocations = ({navigation, route, constants}) => {
  const alertGO = useAlertGO();
  const {popTo, selectInput} = route.params;
  const [selectedInput, setSelectedInput] = useState('D');
  const [searchResponse, setSearchResponse] = useState([]);

  const inputRef = useRef();
  const dispatch = useDispatch();
  const {origin, destination, sessionToken} = useSelector(state => state.toktokGo);

  const [searchDestination, setSearchDestination] = useState(destination?.place?.formattedAddress);
  const [searchOrigin, setSearchOrigin] = useState(origin?.place?.formattedAddress);
  const [recentSearchDataList, setrecentSearchDataList] = useState([]);
  const [recentDestinationList, setrecentDestinationList] = useState([]);
  const [loadingAutoComplete, setLoadingAutoComplete] = useState(false);
  const [noRecordVisible, setNoRecordVisible] = useState(false);
  const [serviceableAreVisible, setServiceableAreVisible] = useState(false);
  const [serviceableAreaScreen, setServiceableAreaScreen] = useState(false);
  const [serviceableAreaList, setServiceableAreaList] = useState('');
  const [savedAddressList, setSavedAddressList] = useState([]);
  const [addressObj, setAddressObj] = useState({});

  useEffect(() => {
    async function tempFunction() {
      await getSearchList();
      await getDestinationList();
      getTripDestinations();
      getSavedAddress();
    }

    tempFunction();

    return () => {};
  }, []);

  const [getSavedAddress] = useLazyQuery(GET_SAVED_ADDRESS, {
    client: TOKTOK_ADDRESS_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setSavedAddressList(response.getAddresses.slice(0, 3));
    },
    onError: onError,
  });

  const [getPlaceAutocomplete, {loading}] = useLazyQuery(GET_PLACE_AUTOCOMPLETE, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      if (response.getPlaceAutocomplete.length == 0) {
        alertGO({
          title: 'Location Not Available',
          message: 'Location is no longer available. Please select another location.',
        });
        setSearchResponse([]);
      } else {
        setNoRecordVisible(false);
        setSearchResponse(response.getPlaceAutocomplete);
        setLoadingAutoComplete(false);
        setServiceableAreaScreen(false);
      }
    },
    onError: error => {
      setLoadingAutoComplete(false);
      setNoRecordVisible(false);
      setSearchResponse([]);
      console.log('getPlaceAutocomplete', error);
    },
  });

  const [getTripDestinations] = useLazyQuery(GO_GET_TRIP_DESTINATIONS, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setrecentDestinationList(response.goGetTripDestinations);
    },
    onError: onErrorAppSync,
  });

  const [getPlaceById] = useLazyQuery(GET_PLACE_BY_ID, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      if (selectedInput == 'D') {
        dispatch({type: 'SET_TOKTOKGO_BOOKING_DESTINATION', payload: response.getPlaceById});
      } else {
        dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload: response.getPlaceById});
      }
      onPressLocation();
      addItemToList(response.getPlaceById);
    },
    onError: error => {
      const {graphQLErrors, networkError} = error;

      if (networkError) {
        alertGO({message: 'Network error occurred. Please check your internet connection.'});
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, code, errorType, serviceableArea}) => {
          if (code === 'INTERNAL_SERVER_ERROR') {
            alertGO({title: 'Whooops', message: 'May kaunting aberya, ka-toktok. Keep calm and try again.'});
          } else if (code === 'USER_INPUT_ERROR') {
            alertGO({message});
          } else if (code === 'BAD_USER_INPUT') {
            if (errorType === 'AREA_UNSERVICEABLE') {
              setServiceableAreaScreen(true);
              setSearchResponse(null);
              setServiceableAreaList(serviceableArea);
            } else if (errorType === 'PLACE_NOT_FOUND') {
              alertGO({
                title: 'Location Not Available',
                message: 'Location is no longer available. Please select another location.',
              });
            } else {
              alertGO({message});
              setServiceableAreaScreen(false);
            }
          } else if (code === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else {
            console.log('ELSE ERROR:', error);
            alertGO({title: 'Whooops', message: 'May kaunting aberya, ka-toktok. Keep calm and try again.'});
          }
        });
      }
    },
  });

  const [getPlaceByLocation] = useLazyQuery(GET_PLACE_BY_LOCATION, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      const payload = response.getPlaceByLocation;
      dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload});
      setSearchOrigin(payload?.place?.formattedAddress);
    },
    onError: error => {
      const {graphQLErrors, networkError} = error;

      if (networkError) {
        alertGO({message: 'Network error occurred. Please check your internet connection.'});
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, code, errorType, serviceableArea}) => {
          if (code === 'INTERNAL_SERVER_ERROR') {
            alertGO({title: 'Whooops', message: 'May kaunting aberya, ka-toktok. Keep calm and try again.'});
          } else if (code === 'USER_INPUT_ERROR') {
            alertGO({message});
          } else if (code === 'BAD_USER_INPUT') {
            if (errorType === 'AREA_UNSERVICEABLE') {
              setServiceableAreaScreen(true);
              setServiceableAreaList(serviceableArea);
            } else if (errorType === 'PLACE_NOT_FOUND') {
              alertGO({
                title: 'Location Not Available',
                message: 'Location is no longer available. Please select another location.',
              });
            } else {
              alertGO({message});
              setServiceableAreaScreen(false);
            }
          } else if (code === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else {
            console.log('ELSE ERROR:', error);
            alertGO({title: 'Whooops', message: 'May kaunting aberya, ka-toktok. Keep calm and try again.'});
          }
        });
      }
    },
  });

  const onPressRecentSearch = loc => {
    if (selectedInput == 'D') {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_DESTINATION', payload: loc});
    } else {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload: loc});
    }
    onPressLocation();
  };

  const onPressSavedAddress = loc => {
    if (selectedInput == 'D') {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_DESTINATION', payload: loc});
    } else {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload: loc});
    }
    onPressLocation();
  };

  const onPressRecentDestination = loc => {
    if (selectedInput == 'D') {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_DESTINATION', payload: loc});
    } else {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload: loc});
    }
    onPressLocation();
  };

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

  const setPlaceFunction = async () => {
    const {latitude, longitude} = await currentLocation({showsReverseGeocode: false});
    getPlaceByLocation({
      variables: {
        input: {
          location: {
            latitude: latitude,
            longitude: longitude,
          },
        },
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      const setPlace = async () => {
        await setPlaceFunction();
      };
      if (!origin?.place?.formattedAddress) {
        setPlace();
      }

      if (selectInput) {
        onChangeSelectedInput(selectInput);
      }
    }, [navigation]),
  );

  const onChange = value => {
    setSearchDestination(value);
    debouncedRequest(value);
  };
  const onChangeOrigin = value => {
    setSearchOrigin(value);
    debouncedRequest(value);
  };

  const onPressLocation = () => {
    if (selectedInput == 'D') {
      navigation.push('ToktokGoBookingConfirmDestination', {
        popTo: popTo + 1,
      });
    } else {
      navigation.pop();
      navigation.push('ToktokGoBookingConfirmPickup', {
        popTo: popTo + 1,
        source: 'searchLocation',
      });
    }
  };

  const onSelectPlace = async value => {
    if (selectedInput == 'D') {
      setSearchDestination(value.formattedAddress);
    } else {
      setSearchOrigin(value.formattedAddress);
    }
    getPlaceById({
      variables: {
        input: {
          sessionToken: sessionToken,
          placeId: value.placeId,
          formattedAddress: value.formattedAddress,
        },
      },
    });
  };

  const addItemToList = async response => {
    console.log(response);
    try {
      const data = await AsyncStorage.getItem('recentSearchList');
      if (data === null) {
        const searchList = JSON.stringify([response]);

        await AsyncStorage.setItem('recentSearchList', searchList);
      } else {
        const recentList = JSON.parse(data);
        if (recentList.length >= 3) {
          let obj = recentList.find(o => o.place.formattedAddress === response.place.formattedAddress);
          if (obj != undefined) {
            console.log('SameAddress');
          } else {
            setrecentSearchDataList([]);
            const removedItem = recentList.slice(0, 2);
            removedItem.unshift(response);
            const searchList = JSON.stringify(removedItem);
            await AsyncStorage.setItem('recentSearchList', searchList);
          }
        } else {
          let obj = recentList.find(o => o.place.formattedAddress === response.place.formattedAddress);
          if (obj != undefined) {
            console.log('SameAddress');
          } else {
            recentSearchDataList.push(response);
            const searchList = JSON.stringify(recentSearchDataList);
            await AsyncStorage.setItem('recentSearchList', searchList);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getSearchList = async () => {
    try {
      const data = await AsyncStorage.getItem('recentSearchList');

      const output = JSON.parse(data);
      if (output != null) {
        setrecentSearchDataList(output);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getDestinationList = async () => {
    try {
      const data = await AsyncStorage.getItem('recentDestinationList');

      const output = JSON.parse(data);
      if (output != null) {
        setrecentDestinationList(output);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onChangeSelectedInput = value => {
    setSelectedInput(value);
    if (value == 'D') {
      debouncedRequest(searchDestination);
    } else {
      debouncedRequest(searchOrigin);
    }
  };

  const getAddressObj = address => {
    const addresses = {hash: address.placeHash, place: address.place};
    onPressSavedAddress(addresses);
    navigation.push('ToktokGoBookingConfirmDestination', {
      popTo: popTo + 1,
    });
  };

  const navigateToSavedAddress = () => {
    navigation.push('ToktokSavedLocations', {getAddressObj});
  };

  return (
    <View style={{backgroundColor: CONSTANTS.COLOR.WHITE, flex: 1, justifyContent: 'space-between'}}>
      <View>
        <Header navigation={navigation} />
        <Location
          onChangeOrigin={onChangeOrigin}
          onChange={onChange}
          inputRef={inputRef}
          selectedInput={selectedInput}
          onChangeSelectedInput={onChangeSelectedInput}
          titleOrigin={searchOrigin}
          title={searchDestination}
          setSearchDestination={setSearchDestination}
          setSearchOrigin={setSearchOrigin}
          loading={loading}
          setLoadingAutoComplete={setLoadingAutoComplete}
          loadingAutoComplete={loadingAutoComplete}
          setSearchResponse={setSearchResponse}
        />
        {searchResponse?.length == 0 ? (
          <View>
            {recentSearchDataList.length == 0 && recentDestinationList.length == 0 ? (
              <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 110}}>
                <Image source={DestinationBC} resizeMode={'contain'} style={{height: 200, width: 200}} />
                <Text
                  style={{
                    fontSize: CONSTANTS.FONT_SIZE.L,
                    color: CONSTANTS.COLOR.ORANGE,
                    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
                  }}>
                  No Recent Destination
                </Text>
                <Text
                  style={{
                    fontSize: CONSTANTS.FONT_SIZE.M,
                  }}>
                  You don’t have recent destination yet.
                </Text>
              </View>
            ) : (
              <View>
                {serviceableAreaScreen == true ? (
                  <OutsideServiceableArea
                    setServiceableAreVisible={setServiceableAreVisible}
                    serviceableAreVisible={serviceableAreVisible}
                    serviceableAreaList={serviceableAreaList}
                  />
                ) : (
                  <View>
                    {recentSearchDataList.length == 0 && recentDestinationList.length == 0 ? null : (
                      <View>
                        {recentSearchDataList.length == 0 ? null : (
                          <FrequentlyUsed
                            navigation={navigation}
                            popTo={popTo}
                            recentSearchDataList={recentSearchDataList}
                            onPressRecentSearch={onPressRecentSearch}
                          />
                        )}
                        {savedAddressList.length == 0 ? null : (
                          <View>
                            {recentSearchDataList.length != 0 && (
                              <View style={{borderBottomWidth: 6, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />
                            )}
                            <SavedAddress
                              savedAddressList={savedAddressList}
                              navigateToSavedAddress={navigateToSavedAddress}
                              onPressSavedAddress={onPressSavedAddress}
                              recentSearchDataList={recentSearchDataList}
                            />
                          </View>
                        )}
                        {savedAddressList.length == 0 ? null : (
                          <View>
                            {recentSearchDataList.length != 0 && (
                              <View style={{borderBottomWidth: 6, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />
                            )}
                            <SavedLocations
                              navigation={navigation}
                              popTo={popTo}
                              recentDestinationList={recentDestinationList}
                              onPressRecentDestination={onPressRecentDestination}
                            />
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        ) : (
          <View>
            {serviceableAreaScreen == true ? (
              <OutsideServiceableArea
                setServiceableAreVisible={setServiceableAreVisible}
                serviceableAreVisible={serviceableAreVisible}
                serviceableAreaList={serviceableAreaList}
              />
            ) : (
              <SearchLocation searchResponse={searchResponse} onSelectPlace={onSelectPlace} />
            )}
          </View>
        )}
      </View>
      <ThrottledHighlight
        delay={500}
        onPress={() => {
          if (selectedInput == 'D') {
            navigation.push('ToktokGoBookingConfirmDestination', {
              popTo: popTo + 1,
            });
          } else {
            navigation.push('ToktokGoBookingConfirmPickup', {
              popTop: 1,
            });
          }
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
            {selectedInput == 'D' ? (
              <Image source={DestinationIcon} style={{height: 20, width: 35, marginRight: 5}} resizeMode={'contain'} />
            ) : (
              <FA5Icon name="map-pin" size={15} color={CONSTANTS.COLOR.YELLOW} style={{marginRight: 10}} />
            )}

            <Text
              style={{
                color: selectedInput == 'D' ? CONSTANTS.COLOR.ORANGE : CONSTANTS.COLOR.YELLOW,
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

const mapStateToProps = state => ({
  constants: state.constants,
});

export default connect(mapStateToProps, null)(ToktokGoSelectedLocations);
