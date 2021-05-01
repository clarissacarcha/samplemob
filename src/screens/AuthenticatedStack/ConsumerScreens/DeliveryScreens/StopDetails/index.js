import React, {useState, useRef, useMemo, useEffect, useCallback} from 'react';
import {Text, View, TextInput, StyleSheet} from 'react-native';
import {throttle, debounce} from 'lodash';
import {useLazyQuery} from '@apollo/react-hooks';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import uuid from 'react-native-uuid';
import axios from 'axios';
import MapView, {Marker, PROVIDER_GOOGLE, Callout, Overlay} from 'react-native-maps';

import {HeaderBack, HeaderTitle} from '../../../../../components';
import {WhiteButton, BlackButton, TouchableIcon} from '../../../../../revamp';
import {LIGHT, ORANGE, PROTOCOL, FONT_REGULAR} from '../../../../../res/constants';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

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

  const inputRef = useRef();
  const bottomSheetRef = useRef();
  const markerRef = useRef(null);

  const snapPoints = useMemo(() => [0, 300], []);

  const onLocationSelect = (value) => {
    console.log({value});
    setShowMap(true);
    bottomSheetRef.current.snapTo(1);
    setStopData({...stopData, latitude: value.location.latitude, longitude: value.location.longitude});
    setSearchText(value.formattedAddress);
  };

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => (
      <View>
        {!showMap && (
          <SearchBar
            sessionToken={sessionToken}
            placeholder={route.params.searchPlaceholder}
            searchText={searchText}
            onSearchTextChange={(value) => setSearchText(value)}
            onSearchResultChange={(value) => setSearchResult(value)}
            searchEnabled={!showMap}
          />
        )}
      </View>
    ),
  });

  return (
    <View style={styles.screenBox}>
      {showMap && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.container}
          region={{
            ...stopData,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          // onRegionChangeComplete={onMapScrollEnd}
        >
          {/*---------------------------------------- FOR CHECKING FLOATING PIN ACCURACY ----------------------------------------*/}
          <Marker ref={markerRef} coordinate={stopData}>
            <FA5Icon name="map-pin" size={24} color="red" />
          </Marker>
        </MapView>
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

      <BottomSheet
        ref={bottomSheetRef}
        index={showMap ? 1 : -1}
        snapPoints={snapPoints}
        handleComponent={() => (
          <View
            style={{
              height: 20,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              borderTopWidth: 3,
              borderRightWidth: 2,
              borderLeftWidth: 2,
              borderColor: ORANGE,
              marginHorizontal: -2,
            }}
          />
        )}>
        <View style={styles.bottomSheetBox}>
          <Text style={{fontFamily: FONT_REGULAR}}>Pick Up Details</Text>
          <View style={{height: 10}} />
          <View style={{flexDirection: 'row', alignItems: 'center', height: 50}}>
            <View style={{width: 25, height: 25, alignItems: 'center', justifyContent: 'center'}}>
              <MaterialCommunityIcon name="map-marker-outline" size={20} color={ORANGE} />
            </View>
            <Text style={{flex: 1, fontFamily: FONT_REGULAR}}>{searchText}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', height: 50}}>
            <View style={{width: 25, height: 25, alignItems: 'center', justifyContent: 'center'}}>
              <FA5Icon name="landmark" size={16} color={ORANGE} />
            </View>
            <TextInput
              placeholder="Landmark"
              value={landmark}
              style={{flex: 1, fontFamily: FONT_REGULAR}}
              onChangeText={setLandmark}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', height: 50}}>
            <View style={{width: 25, height: 25, alignItems: 'center', justifyContent: 'center'}}>
              <MaterialIcon name="person-outline" size={20} color={ORANGE} />
            </View>

            <TextInput
              placeholder="Contact Person"
              value={person}
              style={{flex: 1, fontFamily: FONT_REGULAR}}
              onChangeText={setPerson}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', height: 50}}>
            <View style={{width: 25, height: 25, alignItems: 'center', justifyContent: 'center'}}>
              <MaterialIcon name="phone-android" size={20} color={ORANGE} />
            </View>

            <TextInput
              placeholder="Contact Number"
              value={mobile}
              style={{flex: 1, fontFamily: FONT_REGULAR}}
              onChangeText={setMobile}
            />
          </View>

          <View style={{height: 10}} />
          <BlackButton
            label="Confirm"
            onPress={() => {
              onStopConfirm({
                ...stopData,
                name: person,
                mobile: mobile,
                landmark: landmark,
                formattedAddress: searchText,
              });
              navigation.pop();
            }}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

export default StopDetails;

const styles = StyleSheet.create({
  screenBox: {
    paddingHorizontal: 10,
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
});
