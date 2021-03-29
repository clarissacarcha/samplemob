import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Alert, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import {useQuery} from '@apollo/react-hooks';
import {HeaderBack, HeaderTitle} from '../../../../../components';
import {DARK, COLOR} from '../../../../../res/constants';
import {GET_SAVED_LOCATIONS} from '../../../../../graphql';

import GooglePlacesAutocomplete from './GooglePlacesAutocomplete';

const SearchLocation = ({navigation, route, session, constants}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Search', 'Places']} />,
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

  // const homePlace = {
  //   description: 'Home',
  //   formattedAddress: 'Formatted Home Address',
  //   geometry: {location: {lat: 48.8152937, lng: 2.4597668}},
  // };

  const [savedLocations, setSavedLocations] = useState([]);

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
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        };
      });

      setSavedLocations(mappedSavedLocations);
    },
    onError: () => {
      // Do Nothing
    },
  });

  // data and details
  //   {
  //     "description": "My Malolos",
  //     "formattedAddress": "Malolos, Bulacan, Philippines",
  //     "geometry": {
  //         "location": {
  //             "lat": 14.8527393,
  //             "lng": 120.8160376
  //         }
  //     }
  // }

  const onLocationSelect = (args) => {
    try {
      console.log(JSON.stringify({args}, null, 4));

      setData({
        ...localData,
        latitude: args.location.latitude,
        longitude: args.location.longitude,
        formattedAddress: args.formattedAddress,
        addressBreakdownHash: args.addressBreakdownHash,
      });

      navigation.pop();
    } catch (error) {
      console.log(error);
      Alert.alert('', 'Something went wrong. Please try again.');
      navigation.pop();
    }
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
        <GooglePlacesAutocomplete onLocationSelect={onLocationSelect} savedLocations={savedLocations} />
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
  constants: state.constants,
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
