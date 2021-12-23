import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, TextInput, Alert} from 'react-native';
import {connect} from 'react-redux';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {debounce} from 'lodash';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {COLOR, DARK, MEDIUM, LIGHT, MAP_DELTA_LOW} from '../../../../res/constants';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../components';
import ENVIRONMENTS from '../../../../common/res/environments';
import {POST_SAVED_LOCATION} from '../../../../graphql';
import {onError} from '../../../../util/ErrorUtility';
import {useMutation} from '@apollo/react-hooks';
import uuid from 'react-native-uuid';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';

import {AutocompleteResult} from './AutocompleteResult';
import {SearchLoadingIndicator} from './SearchLoadingIndicator';

const AddLocation = ({navigation, route, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Add', 'Location']} />,
  });

  const {onSavedLocationAdded} = route.params;

  const [postSavedLocation, {loading}] = useMutation(POST_SAVED_LOCATION, {
    onError: onError,
    onCompleted: ({postSavedLocation}) => {
      onSavedLocationAdded(postSavedLocation);
      navigation.pop();
    },
  });

  const [searchText, setSearchText] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    formattedAddress: null,
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchresult] = useState([]);
  const [sessionToken, setSessionToken] = useState(uuid.v4());

  const setMapData = data => {
    setLocationData(data);
    setSearchText(data.formattedAddress);
  };

  const onLocationSelect = data => {
    console.log(JSON.stringify(data, null, 4));
    // console.log(JSON.stringify(details.geometry.location.lat, null, 4));
    // console.log(JSON.stringify(details.geometry.location.lng, null, 4));
    // console.log(JSON.stringify(data.description, null, 4));
    // console.log(JSON.stringify(data.formattedAddress, null, 4));

    setSearchText(data.formattedAddress);
    setLocationData({
      latitude: data.location.latitude,
      longitude: data.location.longitude,
      formattedAddress: data.formattedAddress,
    });

    setSearchresult([]);
  };

  const onSave = () => {
    if (!locationData.latitude) {
      Alert.alert('', 'Please search for a location.');
      return;
    }

    if (locationName == '') {
      Alert.alert('', 'Please enter location name.');
      return;
    }

    postSavedLocation({
      variables: {
        input: {
          name: locationName,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          formattedAddress: locationData.formattedAddress,
          tokConsumerId: session.user.consumer.id,
        },
      },
    });
  };

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

  const onSearchMap = () => {
    navigation.navigate('SearchMap', {data: {...locationData, ...MAP_DELTA_LOW}, setData: setMapData});
  };

  const getGooglePlaceAutocomplete = async ({searchString}) => {
    try {
      setSearchLoading(true);

      const accessToken = await AsyncStorage.getItem('accessToken');
      const authorizationHeader = `Bearer ${accessToken}`;

      const apiResult = await axios({
        url: `${ENVIRONMENTS.TOKTOK_SERVER}/graphql`,
        method: 'post',
        headers: {
          Authorization: authorizationHeader,
        },
        data: {
          query: `
                query {
                  getGooglePlaceAutocomplete(input:{
                    searchString: "${searchString}"
            
                    sessionToken: "${sessionToken}"
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

      if (apiResult.data.data.getGooglePlaceAutocomplete) {
        setSearchresult(apiResult.data.data.getGooglePlaceAutocomplete);
      }
      setSearchLoading(false);
    } catch (error) {
      console.log({error});
      setSearchLoading(false);
    }
  };

  const debouncedGetGooglePlaceAutocomplete = useDebounce(
    value => getGooglePlaceAutocomplete({searchString: value}),
    1000,
  );

  const onChangeText = value => {
    console.log({value});

    setSearchText(value);

    // if (value.length < 3) {
    //   onSearchResultChange({
    //     payload: {
    //       success: null, // Means no result yet. Show Loading
    //     },
    //     predictions: [],
    //   });

    //   return;
    // }

    if (value.length >= 3) {
      debouncedGetGooglePlaceAutocomplete(value);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <AlertOverlay visible={loading} />

      {locationData.latitude && (
        <TouchableHighlight onPress={onSearchMap} style={[{marginHorizontal: 20, marginTop: 20}, styles.cardShadow]}>
          <View style={{height: 150}}>
            {/*---------------------------------------- MAP ----------------------------------------*/}
            <MapView
              provider={PROVIDER_GOOGLE}
              style={[styles.map]}
              region={{
                latitude: parseFloat(locationData.latitude),
                longitude: parseFloat(locationData.longitude),
                ...MAP_DELTA_LOW,
              }}
              scrollEnabled={false}
              rotateEnabled={false}
              zoomEnabled={false}
            />
            {/*---------------------------------------- PIN ----------------------------------------*/}
            <View style={styles.floatingPin}>
              <FA5Icon name="map-marker-alt" size={24} color={COLOR} style={{marginTop: -20}} />
            </View>
          </View>
        </TouchableHighlight>
      )}

      <Text style={styles.label}>Location Name</Text>
      <TextInput
        value={locationName}
        onChangeText={value => setLocationName(value)}
        style={styles.input}
        placeholder="Location name"
        placeholderTextColor={LIGHT}
        returnKeyType="done"
      />
      <Text style={styles.label}>Search Location</Text>
      <TextInput
        value={searchText}
        placeholder="Search Location"
        onChangeText={onChangeText}
        placeholderTextColor={LIGHT}
        style={styles.input}
      />
      <View style={{height: 10}} />
      {!searchLoading && searchText !== '' && (
        <AutocompleteResult
          searchResult={searchResult}
          sessionToken={sessionToken}
          setSessionToken={setSessionToken}
          onLocationSelect={onLocationSelect}
          setSearchText={setSearchText}
        />
      )}
      {searchLoading && searchText !== '' && <SearchLoadingIndicator />}
      <View style={{flex: 1}} />
      <TouchableHighlight onPress={onSave} underlayColor={COLOR} style={{borderRadius: 10, margin: 20}}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 16}}>Save</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export const ToktokAddLocation = connect(mapStateToProps, mapDispatchToProps)(AddLocation);

const styles = StyleSheet.create({
  cardShadow: {
    // paddingHorizontal: 20,
    // paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

    overflow: 'hidden',
  },
  submitBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    margin: 20,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    paddingLeft: 20,
    height: 50,
    color: DARK,
  },
  label: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
  map: {
    flex: 1,
  },
  floatingPin: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
