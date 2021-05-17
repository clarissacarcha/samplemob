import React, {useState, useRef, useMemo, useEffect, useCallback} from 'react';
import {Text, View, TextInput, StyleSheet, TouchableHighlight, TouchableOpacity, StatusBar} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import InputScrollView from 'react-native-input-scroll-view';
import uuid from 'react-native-uuid';
import axios from 'axios';
import MapView, {Marker, PROVIDER_GOOGLE, Callout, Overlay} from 'react-native-maps';

import validator from 'validator';
import {useAlert} from '../../../../../hooks';

import {HeaderBack, HeaderTitle} from '../../../../../components';
import {WhiteButton, BlackButton, YellowButton, TouchableIcon, VectorIcon, ICON_SET} from '../../../../../revamp';
import {DARK} from '../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE, SIZE, MAP_DELTA} from '../../../../../res/variables';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';

//SELF IMPORTS
import AutocompleteResult from './AutocompleteResult';
import SearchBar from './SearchBar';

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

  const {onStopConfirm} = route.params;

  const [showMap, setShowMap] = useState(stopData.latitude ? true : false);

  const AlertHook = useAlert();

  const onLocationSelect = (value) => {
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
  //   headerLeft: () => <HeaderBack />,
  //   headerTitle: () => (
  //     <View>
  //       {!showMap && (
  //         <SearchBar
  //           sessionToken={sessionToken}
  //           placeholder={route.params.searchPlaceholder}
  //           searchText={searchText}
  //           onSearchTextChange={(value) => setSearchText(value)}
  //           onSearchResultChange={(value) => setSearchResult(value)}
  //           searchEnabled={!showMap}
  //         />
  //       )}
  //     </View>
  //   ),
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
        onContactSelectCallback: (value) => {
          console.log({value});

          setPerson(value.name);
          setMobile(value.number);
        },
      });
    }
  };

  const onMobileChange = (value) => {
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
        formattedAddress: searchText,
      },
      navigation,
    );
  };

  return (
    <View style={styles.screenBox}>
      <View style={{height: StatusBar.currentHeight}} />
      <View
        style={{
          height: 50,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderColor: COLOR.LIGHT,
          flexDirection: 'row',
        }}>
        <SearchBar
          sessionToken={sessionToken}
          placeholder={route.params.searchPlaceholder}
          searchText={searchText}
          onSearchTextChange={(value) => setSearchText(value)}
          onSearchResultChange={(value) => setSearchResult(value)}
          searchEnabled={!showMap}
        />
      </View>

      {showMap && (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <InputScrollView
              showsVerticalScrollIndicator={false}
              keyboardOffset={60}
              topOffset={50}
              keyboardAvoidingViewProps={{behavior: 'padding'}}>
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
                      <FA5Icon name="map-pin" size={24} color={COLOR.BLACK} style={{marginTop: -20}} />
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
                      color={COLOR.BLACK}
                    />
                    <View style={{marginLeft: SIZE.MARGIN / 2, flex: 1}}>
                      <Text numberOfLines={1}>{stopData.formattedAddress}</Text>
                    </View>
                    <VectorIcon
                      iconSet={ICON_SET.Entypo}
                      name="chevron-thin-right"
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
              </View>
            </InputScrollView>
          </View>
          <View style={{backgroundColor: COLOR.LIGHT}}>
            <YellowButton onPress={onConfirmInformation} label="Confirm Information" style={{margin: SIZE.MARGIN}} />
          </View>
        </View>
      )}
      {!showMap && (
        <AutocompleteResult
          searchResult={searchResult}
          sessionToken={sessionToken}
          setSessionToken={setSessionToken}
          onLocationSelect={onLocationSelect}
          setSearchText={setSearchText}
        />
      )}
    </View>
  );
};

export default StopDetails;

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
  bottomSheetBox: {
    paddingHorizontal: 10,
  },
  input: {
    height: 50,
    backgroundColor: COLOR.LIGHT,
    borderRadius: 5,
    paddingHorizontal: SIZE.MARGIN,
  },
  box: {
    marginBottom: SIZE.MARGIN,
  },
  floatingPin: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
