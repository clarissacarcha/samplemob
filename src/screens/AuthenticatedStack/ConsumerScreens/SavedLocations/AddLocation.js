import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
  Image,
  Linking,
  FlatList,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  COLOR,
  DARK,
  ORANGE,
  MEDIUM,
  LIGHT,
  MAPS_API_KEY,
  MAP_DELTA_LOW,
  COLOR_UNDERLAY,
} from '../../../../res/constants';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../components';
import {POST_SAVED_LOCATION} from '../../../../graphql';
import {onError} from '../../../../util/ErrorUtility';
import {useMutation} from '@apollo/react-hooks';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';

// const homePlace = {
//   description: 'Home',
//   formattedAddress: 'Formatted Home Address',
//   geometry: {location: {lat: 48.8152937, lng: 2.4597668}},
// };
// const workPlace = {
//   description: 'Work',
//   formattedAddress: 'Formatted Work Address',
//   geometry: {location: {lat: 48.8496818, lng: 2.2940881}},
// };

const GooglePlacesInput = ({onLocationSelect}) => {
  return (
    <GooglePlacesAutocomplete
      // predefinedPlaces={[homePlace, workPlace]}
      placeholder="Search Location"
      minLength={2} // minimum length of text to search
      // autoFocus={true}
      // returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
      listViewDisplayed="true" // true/false/undefined
      fetchDetails={true}
      renderDescription={row => row.description} // custom description render
      onPress={onLocationSelect}
      getDefaultValue={() => ''}
      query={{
        key: MAPS_API_KEY,
        components: 'country:PH',
      }}
      styles={{
        textInputContainer: {
          width: '100%',
        },
        description: {
          fontFamily: 'Rubik-Medium',
        },
        listView: {
          backgroundColor: '#FFF',
        },
        textInput: {
          color: DARK,
        },
        predefinedPlacesDescription: {
          color: ORANGE,
        },
      }}
      nearbyPlacesAPI="GooglePlacesSearch"
      debounce={500}
    />
  );
};

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

  const [locationName, setLocationName] = useState('');
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    formattedAddress: null,
  });

  const onLocationSelect = (data, details) => {
    // console.log(JSON.stringify(details, null, 4));
    // console.log(JSON.stringify(details.geometry.location.lat, null, 4));
    // console.log(JSON.stringify(details.geometry.location.lng, null, 4));
    // console.log(JSON.stringify(data.description, null, 4));
    // console.log(JSON.stringify(data.formattedAddress, null, 4));

    setLocationData({
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      formattedAddress: data.formattedAddress ? data.formattedAddress : data.description,
    });
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

  const onSearchMap = () => {
    navigation.navigate('SearchMap', {data: {...locationData, ...MAP_DELTA_LOW}, setData: setLocationData});
  };

  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <AlertOverlay visible={loading} />
      <View style={{flex: 1}}>
        <GooglePlacesInput onLocationSelect={onLocationSelect} />
      </View>

      {locationData.latitude && (
        <TouchableHighlight onPress={onSearchMap} style={[{marginHorizontal: 20}, styles.cardShadow]}>
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
        returnKeyType="next"
      />

      <TouchableHighlight onPress={onSave} underlayColor={COLOR} style={{borderRadius: 10, margin: 20}}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 16}}>Save</Text>
        </View>
      </TouchableHighlight>

      {/* <ScrollView contentContainerStyle={{marginTop: 20}} showsVerticalScrollIndicator={false}>
        <SavedLocation />
        <SavedLocation />
        <SavedLocation />
        <SavedLocation />
        <SavedLocation />
        <SavedLocation />
      </ScrollView> */}
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddLocation);

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
