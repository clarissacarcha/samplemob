import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Text, View, TouchableHighlight, Image} from 'react-native';
import {Location, Header, FrequentlyUsed, SavedLocations, SearchLocation} from './Sections';
import CONSTANTS from '../../../common/res/constants';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {GET_PLACE_AUTOCOMPLETE, GET_PLACE_BY_ID, GET_PLACE_BY_LOCATION} from '../../graphql';
import {TOKTOK_QUOTATION_GRAPHQL_CLIENT} from 'src/graphql';
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
import AsyncStorage from '@react-native-community/async-storage';

const ToktokGoSelectedLocations = ({navigation, route, constants}) => {
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

  useEffect(() => {
    async function tempFunction() {
      await getSearchList();
      await getDestinationList();
    }

    tempFunction();

    return () => {};
  }, []);

  const [getPlaceAutocomplete, {loading}] = useLazyQuery(GET_PLACE_AUTOCOMPLETE, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      console.log('COMPLETED');
      setSearchResponse(response.getPlaceAutocomplete);
    },
    onError: error => console.log('getPlaceAutocomplete', error),
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
    onError: error => console.log('error', error),
  });

  const onPressRecentSearch = loc => {
    if (selectedInput == 'D') {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_DESTINATION', payload: loc});
    } else {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload: loc});
    }
    onPressLocation();
  };

  const [getPlaceByLocation] = useLazyQuery(GET_PLACE_BY_LOCATION, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      console.log(response);
      const payload = response.getPlaceByLocation;
      dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload});
      setSearchOrigin(payload?.place?.formattedAddress);
    },
    onError: error => console.log('error', error),
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
          console.log(obj);
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
      setrecentSearchDataList(output);
      console.log(output);
    } catch (err) {
      console.log(err);
    }
  };
  const getDestinationList = async () => {
    try {
      const data = await AsyncStorage.getItem('recentDestinationList');

      const output = JSON.parse(data);
      console.log(output);
      setrecentDestinationList(output);
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
        />
        {searchResponse?.length == 0 ? (
          <View>
            {recentSearchDataList == null && recentDestinationList == null ? (
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
                {recentSearchDataList == null ? null : (
                  <View>
                    <FrequentlyUsed
                      navigation={navigation}
                      popTo={popTo}
                      recentSearchDataList={recentSearchDataList}
                      onPressRecentSearch={onPressRecentSearch}
                    />
                    {recentDestinationList == null ? null : (
                      <View>
                        <View style={{borderBottomWidth: 6, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />
                        <SavedLocations
                          navigation={navigation}
                          popTo={popTo}
                          recentDestinationList={recentDestinationList}
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        ) : (
          // <ToktokgoBeta />
          <SearchLocation searchResponse={searchResponse} onSelectPlace={onSelectPlace} />
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
            shadowRadius: 50,
            shadowOpacity: 1.0,
            elevation: 20,
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
