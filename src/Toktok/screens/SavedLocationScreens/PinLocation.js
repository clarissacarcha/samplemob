import React, {useState, useRef, useEffect} from 'react';
import {View, TextInput, StyleSheet, ActivityIndicator, FlatList, Image, Text, StatusBar} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Overlay} from 'react-native-maps';
import {HeaderBack, HeaderTitle} from '../../../components';
import {COLOR, DARK, MAP_DELTA} from '../../../res/constants';
import CONSTANTS from '../../../common/res/constants';
import {YellowButton} from '../../../revamp/buttons/YellowButton';
import {useLazyQuery} from '@apollo/react-hooks';
import {GET_PLACE_AUTOCOMPLETE, GET_PLACE_BY_ID, GET_PLACE_BY_LOCATION} from '../../../ToktokGo/graphql';
import {TOKTOK_QUOTATION_GRAPHQL_CLIENT} from 'src/graphql';
import uuid from 'react-native-uuid';
import {useDebounce} from '../../../ToktokGo/helpers';
import {getCurrentLocation, reverseGeocode} from '../../../helper';
3;
import PinLocationIcon from '../../../assets/images/locationIcon.png';
import {ThrottledOpacity} from '../../../components_section';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import SearchICN from '../../../assets/images/SearchIcon.png';
import ClearTextInput from '../../../assets/icons/EraseTextInput.png';
import {MAP_DELTA_LOW} from '../../../res/constants';
import {onError} from '../../../util/ErrorUtility';

const PinLocation = ({navigation, route}) => {
  const mapRef = useRef(null);
  const inputRef = useRef();
  const sessionToken = uuid.v4();
  const {locCoordinates, setConfirmedLocation} = route.params;

  const [disableAddressBox, setDisableAddressBox] = useState(true);
  const [searchedData, setSearchedData] = useState('');
  const [searchedText, setSearchedText] = useState('');
  const [searchedLocation, setSearchedLocation] = useState({});

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['PIN', 'Location']} />,
  });

  const [getPlaceAutocomplete, {data, loading}] = useLazyQuery(GET_PLACE_AUTOCOMPLETE, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setSearchedData(response.getPlaceAutocomplete);
    },
    onError: onError,
  });

  const [getPlaceById] = useLazyQuery(GET_PLACE_BY_ID, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      mapRef.current.animateToRegion(
        {
          latitude: response.getPlaceById.place.location.latitude,
          longitude: response.getPlaceById.place.location.longitude,
          ...MAP_DELTA_LOW,
        },
        350,
      );
      setSearchedLocation(response.getPlaceById);
      setSearchedData(null);
    },
    onError: onError,
  });

  const [getPlaceByLocation, {loading: GPLLoading}] = useLazyQuery(GET_PLACE_BY_LOCATION, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      console.log('zion getPlaceByLocation', response);
      setSearchedLocation(response.getPlaceByLocation);
      setSearchedText(response.getPlaceByLocation.place.formattedAddress);
      setDisableAddressBox(false);
    },
    onError: onError,
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

  const getPlace = item => {
    setSearchedText(item.formattedAddress);

    getPlaceById({
      variables: {
        input: {
          sessionToken: sessionToken,
          placeId: item.placeId,
          formattedAddress: item.formattedAddress,
          service: 'PREF',
        },
      },
    });
  };

  const onMapDrag = useDebounce(
    value =>
      getPlaceByLocation({
        variables: {
          input: {
            location: {
              latitude: value.latitude,
              longitude: value.longitude,
            },
          },
        },
      }),
    1000,
  );

  const onChange = value => {
    debouncedRequest(value);
    setSearchedText(value);
  };

  const onSubmit = () => {
    setConfirmedLocation(searchedLocation);
    navigation.pop();
  };

  const clearSearhedData = () => {
    setSearchedText('');
    setSearchedData({});
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{height: '100%', width: '100%'}}
        initialRegion={locCoordinates}
        showsUserLocation={true}
        onRegionChangeComplete={e => {
          onMapDrag(e);
        }}
      />
      {/*---------------------------------------- ADDRESS BOX ----------------------------------------*/}
      <View style={{position: 'absolute', width: '100%', top: 16}}>
        <View style={styles.addressBox}>
          <Image source={SearchICN} resizeMode={'contain'} style={{width: 20, height: 20, marginLeft: 16}} />
          <TextInput
            ref={inputRef}
            editable={!GPLLoading && !disableAddressBox}
            value={searchedText}
            onChangeText={onChange}
            style={styles.input}
          />
          {loading || GPLLoading ? (
            <ActivityIndicator color={CONSTANTS.COLOR.ORANGE} style={{height: 20, width: 20, marginRight: 16}} />
          ) : searchedText ? (
            <ThrottledOpacity disabled={GPLLoading} delay={4000} onPress={clearSearhedData}>
              <Image source={ClearTextInput} style={{height: 20, width: 20, marginRight: 16}} resizeMode={'contain'} />
            </ThrottledOpacity>
          ) : null}
        </View>

        <FlatList
          style={{
            marginHorizontal: 16,
            borderBottomLeftRadius: 5,
          }}
          showsVerticalScrollIndicator={false}
          data={searchedData}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            const lastItem = index == searchedData.length - 1 ? true : false;
            return (
              <View style={styles.lastSearchedItem}>
                <ThrottledOpacity delay={4000} onPress={() => getPlace(item)}>
                  <View style={[styles.searchedAddresses, lastItem && styles.lastSearchedItem]}>
                    <Text style={{color: CONSTANTS.COLOR.GRAY}}>{item.formattedAddress}</Text>
                  </View>
                  {!lastItem && (
                    <View
                      style={{borderBottomColor: CONSTANTS.COLOR.LIGHT, borderBottomWidth: 1, marginHorizontal: 0}}
                    />
                  )}
                </ThrottledOpacity>
              </View>
            );
          }}
        />
      </View>
      <View style={{alignItems: 'center', zIndex: 999, alignContent: 'center', position: 'absolute'}}>
        <Image
          source={PinLocationIcon}
          style={{height: 36, width: 36, marginTop: -26, zIndex: 1000}}
          resizeMode={'contain'}
        />
      </View>
      {/*---------------------------------------- BUTTON ----------------------------------------*/}
      <View style={styles.submitBox}>
        <YellowButton
          onPress={onSubmit}
          style={{backgroundColor: CONSTANTS.COLOR.ORANGE}}
          label="Confirm"
          labelStyle={{color: 'white'}}
        />
      </View>
    </View>
  );
};

export default PinLocation;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 50,
    marginHorizontal: 16,
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },

  submitBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    margin: 16,
    borderRadius: 5,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 16,
    color: DARK,
  },
  searchedAddresses: {
    paddingLeft: 8,
    paddingVertical: 8,
    backgroundColor: CONSTANTS.COLOR.WHITE,
  },
  lastSearchedItem: {
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});
