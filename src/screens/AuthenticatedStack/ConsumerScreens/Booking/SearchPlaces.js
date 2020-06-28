import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableHighlight} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Button, HeaderBack, HeaderTitle} from '../../../../components';
import {MAPS_API_KEY, DARK, COLOR} from '../../../../res/constants';

const GooglePlacesInput = ({onLocationSelect}) => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      minLength={2} // minimum length of text to search
      autoFocus={true}
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
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
          fontWeight: 'bold',
        },
        listView: {
          backgroundColor: '#FFF',
        },
      }}
      nearbyPlacesAPI="GooglePlacesSearch"
      debounce={500}
    />
  );
};

const SearchLocation = ({navigation, route}) => {
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

  const onLocationSelect = (data, details = null) => {
    setData({
      ...localData,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      formattedAddress: data.description,
    });
    navigation.pop();
  };

  const onSubmit = () => {
    setData(localData);
    navigation.pop();
  };

  return (
    <View style={{flex: 1}}>
      <GooglePlacesInput onLocationSelect={onLocationSelect} />

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

export default SearchLocation;

const styles = StyleSheet.create({
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
