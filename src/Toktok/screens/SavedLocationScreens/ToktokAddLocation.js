import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, TextInput, Alert, Image, Pressable} from 'react-native';
import {connect} from 'react-redux';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {debounce} from 'lodash';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {COLOR, DARK, MEDIUM, LIGHT, MAP_DELTA_LOW} from '../../../res/constants';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../components';
import ENVIRONMENTS from '../../../common/res/environments';
import {POST_SAVED_LOCATION} from '../../../graphql';
import {onError} from '../../../util/ErrorUtility';
import {useMutation} from '@apollo/react-hooks';
import uuid from 'react-native-uuid';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import CONSTANTS from '../../../common/res/constants';
import ToggleSwitch from 'toggle-switch-react-native';

import {AutocompleteResult} from './AutocompleteResult';
import {SearchLoadingIndicator} from './SearchLoadingIndicator';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

import HomeIcon from '../../../assets/icons/home-address-icon.png';
import WorkIcon from '../../../assets/icons/work-address-icon.png';
import OfficeIcon from '../../../assets/icons/office-address-icon.png';

const AddLocation = ({navigation, route, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Add', 'Address']} />,
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

  const [labelSelected, setLabelSelected] = useState('Home');
  const [numLabelSelected, setNumLabelSelected] = useState(1);
  const [isHomeSelected, setIsHomeSelected] = useState(true);
  const [isWorkSelected, setIsWorkSelected] = useState(false);
  const [isOfficeSelected, setIsOfficeSelected] = useState(false);
  const [isCustomSelected, setIsCustomSelected] = useState(false);

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
    // navigation.navigate('SearchMap', {data: {...locationData, ...MAP_DELTA_LOW}, setData: setMapData});
    navigation.navigate('PinLocation', {setData: pinedLocation});
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

  const pinedLocation = value => {
    setSearchText(value);
    console.log('called');
  };

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

  const selectAddressLabel = selected => {
    setLabelSelected(selected);
    if (selected == 'Home') {
      setNumLabelSelected(1);
    } else if (selected == 'Work') {
      setNumLabelSelected(2);
    } else if (selected == 'Office') {
      setNumLabelSelected(3);
    } else if (selected == 'Custom') {
      setNumLabelSelected(4);
    }
  };

  return (
    <>
      <ScrollView style={{flex: 1, backgroundColor: '#FFF'}}>
        <AlertOverlay visible={loading} />

        <View style={styles.labelContainer}>
          <TouchableOpacity onPress={() => selectAddressLabel('Home')}>
            <View style={[styles.labelBox, numLabelSelected == 1 ? styles.labelSelected : null]}>
              <Image source={HomeIcon} resizeMode={'contain'} style={styles.labelIcon} />
              <Text>Home</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => selectAddressLabel('Work')}>
            <View style={[styles.labelBox, numLabelSelected == 2 ? styles.labelSelected : null]}>
              <Image source={WorkIcon} resizeMode={'contain'} style={styles.labelIcon} />
              <Text>Work</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => selectAddressLabel('Office')}>
            <View style={[styles.labelBox, numLabelSelected == 3 ? styles.labelSelected : null]}>
              <Image source={OfficeIcon} resizeMode={'contain'} style={styles.labelIcon} />
              <Text>Office</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => selectAddressLabel('Custom')}>
            <View style={[styles.labelBox, numLabelSelected == 4 ? styles.labelSelected : null]}>
              <Text>Custom</Text>
            </View>
          </TouchableOpacity>
        </View>

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

        {numLabelSelected == 4 && (
          <>
            <Text style={styles.label}>Custom Label</Text>
            <TextInput
              // value={locationName}
              // onChangeText={value => setLocationName(value)}
              style={styles.input}
              placeholder="Contact Name"
              placeholderTextColor={LIGHT}
              returnKeyType="done"
            />
          </>
        )}

        <Text style={styles.label}>Contact Name</Text>
        <TextInput
          // value={locationName}
          // onChangeText={value => setLocationName(value)}
          style={styles.input}
          placeholder="Contact Name"
          placeholderTextColor={LIGHT}
          returnKeyType="done"
        />

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          // value={locationName}
          // onChangeText={value => setLocationName(value)}
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor={LIGHT}
          returnKeyType="done"
        />

        <Text style={styles.label}>Address</Text>
        {/*-------ON PRESS: NAVIGATE TO PIN ADDRESS SCREEN----*/}
        <Pressable onPress={onSearchMap}>
          <View pointerEvents="none">
            <TextInput value={searchText} onChangeText={onChangeText} style={styles.input} />
          </View>
        </Pressable>

        {/* <View style={{height: 10}} />
        {!searchLoading && searchText !== '' && (
          <AutocompleteResult
            searchResult={searchResult}
            sessionToken={sessionToken}
            setSessionToken={setSessionToken}
            onLocationSelect={onLocationSelect}
            setSearchText={setSearchText}
          />
        )}
        {searchLoading && searchText !== '' && <SearchLoadingIndicator />} */}

        <Text style={styles.label}>Postal Code (optional)</Text>
        <TextInput
          // value={locationName}
          // onChangeText={value => setLocationName(value)}
          style={styles.input}
          placeholder="Contact Name"
          placeholderTextColor={LIGHT}
          returnKeyType="done"
        />

        <Text style={styles.label}>Landmark</Text>
        <TextInput
          // value={locationName}
          // onChangeText={value => setLocationName(value)}
          style={[styles.input, {}]}
          multiline={true}
          placeholder="Complete address for accurate and faster delivery/
        Landmark nearby location"
          placeholderTextColor={LIGHT}
        />

        <View style={styles.lineDivider} />
        <View style={styles.toggleContainer}>
          <Text>Set as default address</Text>
          {/*-------TO DO: ADD CONDITION----*/}
          <ToggleSwitch
            isOn={true}
            onColor={CONSTANTS.COLOR.ORANGE}
            offColor={CONSTANTS.COLOR.MEDIUM}
            size="small"
            // onToggle={toggleOnlineStatus}
          />
        </View>
        <View style={styles.lineDivider} />
      </ScrollView>
      <View style={styles.submitContainer}>
        <TouchableHighlight onPress={onSave} underlayColor={COLOR} style={{borderRadius: 10}}>
          <View style={styles.submit}>
            <Text style={styles.submitText}>Save</Text>
          </View>
        </TouchableHighlight>
      </View>

      {/*-------TO DO: ADD CONDITION----*/}
      {false && (
        <View style={[styles.submitContainer, styles.editAddressContainer]}>
          <TouchableHighlight onPress={onSave} underlayColor={COLOR} style={{borderRadius: 10}}>
            <View style={styles.deleteButtonWraper}>
              <Text style={[styles.submitText, {color: CONSTANTS.COLOR.ORANGE}]}>Delete</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={onSave} underlayColor={COLOR} style={{borderRadius: 10}}>
            <View style={[styles.submit, {paddingHorizontal: '18%'}]}>
              <Text style={styles.submitText}>Save</Text>
            </View>
          </TouchableHighlight>
        </View>
      )}
    </>
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
  labelSelected: {
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  labelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',

    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  labelIcon: {
    width: 12,
    height: 12,
    marginRight: 6,
  },
  labelContainer: {
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
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
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginHorizontal: 16,
    backgroundColor: CONSTANTS.COLOR.MEDIUM_DARK,
    borderRadius: 10,
    padding: 16,
    color: DARK,
  },
  label: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: MEDIUM,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  map: {
    flex: 1,
  },
  floatingPin: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  lineDivider: {
    marginVertical: 16,
    marginHorizontal: -16,
    borderBottomWidth: 2,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
  },
  submitContainer: {
    paddingHorizontal: 32,
    paddingVertical: 15,
    backgroundColor: 'white',
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
  editAddressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButtonWraper: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '18%',
    height: 49,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    backgroundColor: CONSTANTS.COLOR.WHITE,
  },
});
