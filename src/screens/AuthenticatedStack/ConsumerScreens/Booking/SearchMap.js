import React, {useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, TouchableHighlight} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Overlay} from 'react-native-maps';
import {HeaderBack, HeaderTitle} from '../../../../components';
import {COLOR, DARK, MAP_DELTA} from '../../../../res/constants';
import {YellowButton} from '../../../../revamp/buttons/YellowButton';

import {reverseGeocode} from '../../../../helper';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';

const SearchMap = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Search', 'Map']} />,
  });

  let loading = false;
  const {data, setData} = route.params;
  const [localData, setLocalData] = useState({
    ...data,
  });

  const onMapScrollEnd = async (data) => {
    if (!loading) {
      loading = true;
      const result = await reverseGeocode(data);
      setLocalData({
        ...localData,
        latitude: data.latitude,
        longitude: data.longitude,
        latitudeDelta: data.latitudeDelta,
        longitudeDelta: data.longitudeDelta,
        formattedAddress: result.formattedAddress,
      });
      loading = false;
    }
  };

  const onSubmit = () => {
    setData({...localData, ...MAP_DELTA});
    navigation.pop();
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.container}
        region={{
          ...localData,
        }}
        onRegionChangeComplete={onMapScrollEnd}>
        {/*---------------------------------------- FOR CHECKING FLOATING PIN ACCURACY ----------------------------------------*/}
        {/*<Marker coordinate={localData}>*/}
        {/*  <FA5Icon name="map-pin" size={24} color="red" />*/}
        {/*</Marker>*/}
      </MapView>
      {/*---------------------------------------- ADDRESS BOX ----------------------------------------*/}
      <View style={styles.addressBox}>
        <Text>{localData.formattedAddress}</Text>
      </View>
      {/*---------------------------------------- FLOATING PIN ----------------------------------------*/}
      <FA5Icon name="map-pin" size={24} color={DARK} style={{marginTop: -26}} />
      {/*---------------------------------------- BUTTON ----------------------------------------*/}
      <View style={styles.submitBox}>
        <YellowButton onPress={onSubmit} label="Confirm Location" />
      </View>

      {/* <TouchableHighlight onPress={onSubmit} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>Confirm</Text>
        </View>
      </TouchableHighlight> */}
    </View>
  );
};

export default SearchMap;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressBox: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    height: 50,
    margin: 16,
    justifyContent: 'center',
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
  floatingPin: {
    // ...StyleSheet.absoluteFillObject,
    // justifyContent: 'center',
    // alignItems: 'center',
    // bottom: 0,
    // left: 0,
    // right: 0,
    // top: 0
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
});
