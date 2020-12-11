import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableHighlight, ScrollView, Alert, ActivityIndicator, Image} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {connect} from 'react-redux';
import {useQuery} from '@apollo/react-hooks';
import {Button, HeaderBack, HeaderTitle} from '../../../../components';
import {YellowIcon} from '../../../../components/ui';
import {MAPS_API_KEY, DARK, COLOR, MEDIUM, ORANGE} from '../../../../res/constants';
import {GET_SAVED_LOCATIONS} from '../../../../graphql';

const GooglePlacesInput = ({onLocationSelect, savedLocations}) => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search Location"
      predefinedPlaces={savedLocations}
      minLength={2} // minimum length of text to search
      autoFocus={true}
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
      listViewDisplayed="true" // true/false/undefined
      fetchDetails={true}
      renderDescription={(row) => row.description} // custom description render
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

const SearchLocation = ({navigation, route, session}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Search', 'places']} />,
  });

  const {data, setData} = route.params;
  /**
   * name
   * mobile
   * landmark
   * latitude
   * longitude
   * formattedAddress
   */
  const [localData, setLocalData] = useState({
    ...data,
    latitude: 0,
    longitude: 0,
    formattedAddress: '',
  });

  const [savedLocations, setSavedLocations] = useState([]);

  // const homePlace = {
  //   description: 'Home',
  //   formattedAddress: 'Formatted Home Address',
  //   geometry: {location: {lat: 48.8152937, lng: 2.4597668}},
  // };

  const {loading, error} = useQuery(GET_SAVED_LOCATIONS, {
    fetchPolicy: 'network-only',
    variables: {
      filter: {
        tokConsumerId: session.user.consumer.id,
      },
    },
    onCompleted: ({getSavedLocations}) => {
      const mappedSavedLocations = getSavedLocations.map((location) => {
        return {
          description: location.name,
          formattedAddress: location.formattedAddress,
          geometry: {
            location: {
              lat: location.latitude,
              lng: location.longitude,
            },
          },
        };
      });

      setSavedLocations(mappedSavedLocations);
    },
  });

  const onLocationSelect = (data, details = null) => {
    try {
      setData({
        ...localData,
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        formattedAddress: data.formattedAddress ? data.formattedAddress : data.description,
      });
      navigation.pop();
    } catch (error) {
      console.log(error);
      Alert.alert('', 'Something went wrong. Please try again.');
      navigation.pop();
    }
  };

  const onSubmit = () => {
    setData(localData);
    navigation.pop();
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={24} color={COLOR} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Something Went Wrong</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <View style={{height: 350}}>
        <GooglePlacesInput onLocationSelect={onLocationSelect} savedLocations={savedLocations} />
      </View>

      {/* <TouchableHighlight onPress={onSubmit} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>Confirm</Text>
        </View>
      </TouchableHighlight> */}

      {/* <Button
        title="CONFIRM"
        onPress={onConfirm}
        containerStyle={{padding: 20}}
        {...(!localData.formattedAddress ? {disabled: true} : null)}
      /> */}
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(SearchLocation);

const styles = StyleSheet.create({
  cardShadow: {
    padding: 20,
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
});
