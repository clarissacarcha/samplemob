import React, {useState, useRef, useMemo, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
  FlatList,
  ScrollView,
} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {throttle, debounce, set} from 'lodash';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import InputScrollView from 'react-native-input-scroll-view';
import {PREF_GET_SAVED_ADDRESSES, TOKTOK_ADDRESS_CLIENT, GET_DELIVERY_RECENT_RECIPIENTS} from '../../../../../graphql';
import {onError} from '../../../../../util/ErrorUtility';
import uuid from 'react-native-uuid';
import MapView, {Marker, PROVIDER_GOOGLE, Callout, Overlay} from 'react-native-maps';
import validator from 'validator';
import {useAlert} from '../../../../../hooks';
import AsyncStorage from '@react-native-community/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {Shadow, YellowButton, VectorIcon, ICON_SET} from '../../../../../revamp';
import {MEDIUM, DARK} from '../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE, SIZE, MAP_DELTA} from '../../../../../res/variables';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';

//SELF IMPORTS
import SavedAddresses from '../Components/SavedAddresses';
import RecentDelivery from '../Components/RecentDelivery';
import RecentSearch from './RecentSearch';
import AutocompleteResult from './AutocompleteResult';
import SearchBar from './SearchBar';
import {SearchLoadingIndicator} from './SearchLoadingIndicator';
import {BackButton} from '../../../../../components_section/Buttons';
import {HeaderTitle} from '../../../../../components_section/Texts';

const INITIAL_RESULT = {
  payload: {
    success: null, // Means no result yet. Show Loading
  },
  predictions: [],
};

const StopDetails = ({navigation, route}) => {
  const [stopData, setStopData] = useState(route.params.stopData);

  const [searchText, setSearchText] = useState(stopData.formattedAddress);
  const [landmark, setLandmark] = useState(route.params.stopData.landmark);
  const [person, setPerson] = useState(route.params.stopData.name);
  const [mobile, setMobile] = useState(route.params.stopData.mobile);

  const [searchResult, setSearchResult] = useState(INITIAL_RESULT);
  const [sessionToken, setSessionToken] = useState(uuid.v4());

  const AlertHook = useAlert();

  const {onStopConfirm} = route.params;

  const [showMap, setShowMap] = useState(stopData.latitude ? true : false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [recentSearchDataList, setRecentSearchDataList] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [seeAlltoggle, setsSeeAllToggle] = useState(false);

  navigation.setOptions({
    headerLeft: () => <BackButton navigation={navigation} />,
    headerTitle: () => <HeaderTitle label={'Address'} />,
  });

  const onLocationSelect = value => {
    addItemToList(value);
    console.log({value});
    setShowMap(true);
    setStopData({
      ...stopData,
      latitude: value.location.latitude,
      longitude: value.location.longitude,
      formattedAddress: value.formattedAddress,
    });
    setSearchText(value.formattedAddress);
  };

  // navigation.setOptions({
  //   headerShown: false,
  // });

  const onSearchMap = () => {
    navigation.push('SearchMap', {data: {...stopData, ...MAP_DELTA.LOW}, setData: setStopData});
  };

  const goToContacts = async () => {
    const checkAndRequest = Platform.select({
      android: async () => {
        const checkResult = await check(PERMISSIONS.ANDROID.READ_CONTACTS);

        if (checkResult === RESULTS.GRANTED) {
          return true;
        }

        if (checkResult === RESULTS.BLOCKED) {
          Alert.alert(
            '',
            "Contacts access have been blocked. Please allow toktok to access your contacts in your phone's settings.",
          );
          return false;
        }

        if (checkResult === RESULTS.UNAVAILABLE) {
          Alert.alert('', 'Access to contacts is unavailable.');
          return false;
        }

        if (checkResult === RESULTS.DENIED) {
          const requestResult = await request(PERMISSIONS.ANDROID.READ_CONTACTS);

          if (requestResult === RESULTS.GRANTED) {
            return true;
          }

          if (requestResult === RESULTS.BLOCKED) {
            Alert.alert(
              '',
              "Contacts access have been blocked. Please allow toktok to access your contacts in your phone's settings.",
            );
            return false;
          }

          if (requestResult === RESULTS.DENIED) {
            Alert.alert('', "Sorry, we can't access your contacts without sufficient permission.");
            return false;
          }
        }
      },
      ios: async () => {
        const checkResult = await check(PERMISSIONS.IOS.CONTACTS);

        if (checkResult === RESULTS.GRANTED) {
          return true;
        }

        if (checkResult === RESULTS.BLOCKED) {
          Alert.alert(
            '',
            "Contacts access have been blocked. Please allow toktok to access your contacts in your phone's settings.",
          );
          return false;
        }

        if (checkResult === RESULTS.UNAVAILABLE) {
          Alert.alert('', 'Access to contacts is unavailable.');
          return false;
        }

        if (checkResult === RESULTS.DENIED) {
          const requestResult = await request(PERMISSIONS.IOS.CONTACTS);
          if (requestResult === RESULTS.GRANTED) {
            return true;
          }

          if (requestResult === RESULTS.BLOCKED) {
            Alert.alert(
              '',
              "Contacts access have been blocked. Please allow toktok to access your contacts in your phone's settings.",
            );
            return false;
          }
        }
      },
    });

    const result = await checkAndRequest();

    if (result) {
      navigation.push('SearchContact', {
        onContactSelectCallback: value => {
          console.log({value});

          setPerson(value.name);
          setMobile(value.number);
        },
      });
    }
  };

  const onMobileChange = value => {
    if (value.length === 1 && value === '0') {
      setMobile('');
      return;
    }

    if (value.length > 10) {
      setMobile(mobile);
      return;
    }

    setMobile(value);
  };

  const onConfirmInformation = () => {
    if (stopData.latitude === null || stopData.longitude === null) {
      AlertHook({message: 'Please enter location.'});
      return;
    }

    if (validator.isEmpty(person, {ignore_whitespace: true})) {
      AlertHook({message: "Please enter contact person's name."});
      return;
    }

    if (validator.isEmpty(mobile, {ignore_whitespace: true})) {
      AlertHook({message: 'Please enter mobile number.'});
      return;
    }

    if (isNaN(mobile)) {
      AlertHook({message: 'Please enter a mobile number.'});
      return;
    }

    if (mobile.length !== 10) {
      AlertHook({message: 'Please enter a valid mobile number.'});
      return;
    }

    onStopConfirm(
      {
        ...stopData,
        name: person,
        mobile: mobile,
        landmark: landmark,
        // formattedAddress: searchText,
      },
      navigation,
    );
    navigation.pop();
  };

  const addItemToList = async response => {
    console.log(response);
    try {
      const data = await AsyncStorage.getItem('recentSearchDeliveryList');
      if (data === null) {
        const searchList = JSON.stringify([response]);

        await AsyncStorage.setItem('recentSearchDeliveryList', searchList);
      } else {
        const recentList = JSON.parse(data);
        if (recentList.length >= 3) {
          let obj = recentList.find(o => o.formattedAddress === response.formattedAddress);
          if (obj != undefined) {
            console.log('SameAddress');
          } else {
            setRecentSearchDataList([]);
            const removedItem = recentList.slice(0, 2);
            removedItem.unshift(response);
            const searchList = JSON.stringify(removedItem);
            await AsyncStorage.setItem('recentSearchDeliveryList', searchList);
          }
        } else {
          let obj = recentList.find(o => o.formattedAddress === response.formattedAddress);
          if (obj != undefined) {
            console.log('SameAddress');
          } else {
            recentSearchDataList.push(response);
            const searchList = JSON.stringify(recentSearchDataList);
            await AsyncStorage.setItem('recentSearchDeliveryList', searchList);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [prefGetSavedAddresses, {loading: PGSALoading}] = useLazyQuery(PREF_GET_SAVED_ADDRESSES, {
    client: TOKTOK_ADDRESS_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: res => {
      setSavedAddresses(res.prefGetSavedAddresses);
    },
    onError: onError,
  });

  const [getDeliveryRecentRecipients, {data: GDRRdata, loading: GDRRLoading}] = useLazyQuery(
    GET_DELIVERY_RECENT_RECIPIENTS,
    {
      fetchPolicy: 'network-only',
      onError: onError,
    },
  );

  const getSearchList = async () => {
    try {
      const data = await AsyncStorage.getItem('recentSearchDeliveryList');

      const output = JSON.parse(data);
      if (output != null) {
        setRecentSearchDataList(output);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      prefGetSavedAddresses();
      getDeliveryRecentRecipients();
    }, []),
  );

  useEffect(() => {
    async function tempFunction() {
      await getSearchList();
    }

    tempFunction();

    return () => {};
  }, [showMap]);

  const onPressAddAddress = item => {
    navigation.push('ToktokAddEditLocation', {coordsFromService: item.location});
  };

  const onSelectSavedAddress = item => {
    setShowMap(true);
    setStopData({
      ...stopData,
      latitude: item.place.location.latitude,
      longitude: item.place.location.longitude,
      formattedAddress: item.place.formattedAddress,
    });
    setSearchText(item.formattedAddress);
    setMobile(item.contactDetails.mobile_no ? item.contactDetails.mobile_no : '');
    setPerson(item.contactDetails.fullname ? item.contactDetails.mobile_no : '');
  };

  const onClearSearchBar = () => {
    setSearchResult({
      ...searchResult,
      predictions: [],
    });
  };

  const onSelectRecentDelivery = item => {
    setShowMap(true);
    setStopData({
      ...stopData,
      latitude: item.hashedPlace.place.location.latitude,
      longitude: item.hashedPlace.place.location.longitude,
      formattedAddress: item.hashedPlace.place.formattedAddress,
    });
    setSearchText(item.hashedPlace.place.formattedAddress);
  };

  return (
    <View style={styles.screenBox}>
      {showMap && (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <InputScrollView showsVerticalScrollIndicator={false} keyboardOffset={20}>
              {stopData.latitude && (
                <TouchableHighlight onPress={onSearchMap} style={{marginBottom: SIZE.MARGIN}}>
                  <View style={{height: 150}}>
                    <MapView
                      provider={PROVIDER_GOOGLE}
                      style={{flex: 1}}
                      region={{
                        latitude: parseFloat(stopData.latitude),
                        longitude: parseFloat(stopData.longitude),
                        ...MAP_DELTA.LOW,
                      }}
                      scrollEnabled={false}
                      rotateEnabled={false}
                      zoomEnabled={false}
                    />
                    <View style={styles.floatingPin}>
                      <FA5Icon name="map-pin" size={24} color={COLOR.YELLOW} style={{marginTop: -20}} />
                    </View>
                  </View>
                </TouchableHighlight>
              )}
              <View style={{marginHorizontal: SIZE.MARGIN}}>
                <Text style={{fontFamily: FONT.BOLD, marginBottom: 2}}>Location</Text>
                <TouchableHighlight
                  onPress={() => {
                    setShowMap(false);
                  }}
                  underlayColor={COLOR.WHITE_UNDERLAY}
                  style={{marginBottom: SIZE.MARGIN, borderRadius: 5}}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      height: 50,
                      alignItems: 'center',

                      borderRadius: 5,
                      flexDirection: 'row',
                    }}>
                    <VectorIcon
                      iconSet={ICON_SET.FontAwesome5}
                      name="map-pin"
                      style={{marginHorizontal: SIZE.MARGIN / 2}}
                      color={COLOR.YELLOW}
                    />
                    <View style={{marginLeft: SIZE.MARGIN / 2, flex: 1}}>
                      <Text numberOfLines={1}>{stopData.formattedAddress}</Text>
                    </View>
                    <VectorIcon
                      iconSet={ICON_SET.Entypo}
                      name="chevron-thin-right"
                      color={COLOR.BLACK}
                      style={{marginHorizontal: SIZE.MARGIN / 2}}
                    />
                  </View>
                </TouchableHighlight>

                <View style={styles.box}>
                  <Text style={{fontFamily: FONT.BOLD, marginBottom: 2}}>Landmark</Text>
                  <View style={styles.spacing} />
                  <TextInput
                    style={styles.input}
                    value={landmark}
                    onChangeText={setLandmark}
                    placeholder="ex. Your complete address or nearby landmark."
                    placeholderTextColor={COLOR.MEDIUM}
                  />
                </View>

                <View style={styles.box}>
                  <Text style={{fontFamily: FONT.BOLD, marginBottom: 2}}>Contact Person</Text>
                  <View style={styles.spacing} />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: COLOR.LIGHT,
                      borderRadius: SIZE.BORDER_RADIUS,
                    }}>
                    <TextInput
                      style={[styles.input, {flex: 1}]}
                      value={person}
                      onChangeText={setPerson}
                      placeholder="ex. Juan dela Cruz"
                      placeholderTextColor={COLOR.MEDIUM}
                    />
                    <TouchableOpacity
                      onPress={goToContacts}
                      style={{
                        marginRight: SIZE.MARGIN,
                        borderWidth: 1,
                        borderRadius: 3,
                        borderColor: COLOR.YELLOW,
                        padding: 2,
                      }}>
                      <Text style={{fontSize: FONT_SIZE.S, color: COLOR.YELLOW}}>Address Book</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/*--------------- MOBILE NUMBER ---------------*/}
                <View style={{marginBottom: 50}}>
                  <Text style={{fontFamily: FONT.BOLD, marginBottom: 2}}>Contact Person's Number</Text>
                  <View
                    style={{
                      borderRadius: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                      overflow: 'hidden',
                      height: 50,
                      marginBottom: SIZE.MARGIN,
                      backgroundColor: COLOR.LIGHT,
                    }}>
                    <View
                      style={{
                        paddingLeft: SIZE.MARGIN,
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{color: COLOR.BLACK}}>+63</Text>
                    </View>
                    <TextInput
                      value={mobile}
                      onChangeText={onMobileChange}
                      placeholder="9151234567"
                      keyboardType="number-pad"
                      returnKeyType="done"
                      style={{paddingLeft: 8, flex: 1, color: DARK, height: 50}}
                      placeholderTextColor={COLOR.MEDIUM}
                    />
                  </View>
                </View>
                <View style={{height: 50}} />
              </View>
              {/*--------------- CONFIRM ---------------*/}
            </InputScrollView>
          </View>
          <View style={{backgroundColor: COLOR.LIGHT}}>
            <YellowButton onPress={onConfirmInformation} label="Confirm Information" style={{margin: SIZE.MARGIN}} />
          </View>
        </View>
      )}
      {!showMap && !searchLoading && searchText !== '' && (
        <AutocompleteResult
          searchResult={searchResult}
          sessionToken={sessionToken}
          setSessionToken={setSessionToken}
          onLocationSelect={onLocationSelect}
          setSearchText={setSearchText}
        />
      )}
      {!showMap && searchResult?.predictions.length == 0 && (
        <FlatList
          data={[]}
          ListHeaderComponent={() => {
            return (
              <>
                <View
                  style={{
                    marginTop: 16,
                    height: 50,

                    flexDirection: 'row',
                  }}>
                  <SearchBar
                    sessionToken={sessionToken}
                    placeholder={route.params.searchPlaceholder}
                    searchText={searchText}
                    onSearchTextChange={value => setSearchText(value)}
                    onSearchResultChange={value => setSearchResult(value)}
                    searchEnabled={!showMap}
                    onSearchLoadingChange={setSearchLoading}
                    navigation={navigation}
                    onClearSearchBar={onClearSearchBar}
                  />
                </View>
              </>
            );
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return (
              <>
                {recentSearchDataList.length > 0 && (
                  <RecentSearch
                    recentSearchDataList={recentSearchDataList}
                    setShowMap={setShowMap}
                    stopData={stopData}
                    setStopData={setStopData}
                    setSearchText={setSearchText}
                    onPressAddAddress={onPressAddAddress}
                  />
                )}

                <SavedAddresses
                  navigation={navigation}
                  data={savedAddresses}
                  onSelectSavedAddress={onSelectSavedAddress}
                  prefGetSavedAddresses={prefGetSavedAddresses}
                />
                {GDRRdata?.getDeliveryRecentRecipients.length > 0 && (
                  <RecentDelivery
                    data={GDRRdata}
                    onSelectRecentDelivery={onSelectRecentDelivery}
                    navigation={navigation}
                  />
                )}
              </>
            );
          }}
        />
      )}

      {!showMap && searchLoading && searchText !== '' && <SearchLoadingIndicator />}
    </View>
  );
};

export const StopInformation = StopDetails;

const styles = StyleSheet.create({
  screenBox: {
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  box: {
    marginBottom: SIZE.MARGIN,
  },
  input: {
    height: 50,
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    paddingHorizontal: SIZE.MARGIN,
  },
  spacing: {
    height: 2,
  },
  floatingPin: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
