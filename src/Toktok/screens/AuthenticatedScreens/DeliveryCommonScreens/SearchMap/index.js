import React, {useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, TouchableHighlight, Dimensions} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Overlay} from 'react-native-maps';
import {HeaderBack, HeaderTitle} from '../../../../../components';
import {COLOR, DARK, MAP_DELTA} from '../../../../../res/constants';
import {YellowButton} from '../../../../../revamp/buttons/YellowButton';
import CONSTANTS from '../../../../../common/res/constants';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

import {reverseGeocode} from '../../../../../helper';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {ThrottledOpacity} from '../../../../../components_section';

const screenWidth = Dimensions.get('window').width;

export const SearchMap = ({navigation, route}) => {
  const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Search', 'Map']} />,
  });

  let loading = false;
  const {data, setData} = route.params;

  const [fakeLoading, setFakeLoading] = useState(false);
  const [showConfirmLocButton, setShowConfirmLocButton] = useState(false);
  const [mapDraggedData, setMapDraggedData] = useState({});
  const [localData, setLocalData] = useState({
    ...data,
  });

  const onMapScrollEnd = value => {
    if (
      value.longitude.toFixed(5) != data.longitude.toFixed(5) &&
      value.latitude.toFixed(5) != data.latitude.toFixed(5)
    ) {
      setShowConfirmLocButton(true);
    } else {
      setShowConfirmLocButton(false);
    }
    setMapDraggedData(value);
  };

  const onConfirmLoc = async () => {
    if (!loading) {
      setFakeLoading(true);

      loading = true;
      const result = await reverseGeocode(mapDraggedData);
      setLocalData({
        ...localData,
        latitude: mapDraggedData.latitude,
        longitude: mapDraggedData.longitude,
        latitudeDelta: mapDraggedData.latitudeDelta,
        longitudeDelta: mapDraggedData.longitudeDelta,
        formattedAddress: result.formattedAddress,
      });
      loading = false;
      setShowConfirmLocButton(false);
      setTimeout(() => {
        setFakeLoading(false);
      }, 500);
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
        initialRegion={{
          ...localData,
        }}
        onRegionChangeComplete={e => onMapScrollEnd(e)}>
        {/*---------------------------------------- FOR CHECKING FLOATING PIN ACCURACY ----------------------------------------*/}
        {/*<Marker coordinate={localData}>*/}
        {/*  <FA5Icon name="map-pin" size={24} color="red" />*/}
        {/*</Marker>*/}
      </MapView>
      {/*---------------------------------------- ADDRESS BOX ----------------------------------------*/}
      <View style={styles.addressBox}>
        {fakeLoading ? (
          <ShimmerPlaceHolder style={{width: screenWidth / 1.13, height: 30}} visible={false} />
        ) : (
          <Text>{localData.formattedAddress}</Text>
        )}
      </View>
      {/*---------------------------------------- FLOATING PIN ----------------------------------------*/}
      {showConfirmLocButton && (
        <ThrottledOpacity onPress={onConfirmLoc} style={styles.floatingButton} delay={4000}>
          <Text style={{color: 'white'}}>Confrim Pin</Text>
        </ThrottledOpacity>
      )}
      <FA5Icon name="map-pin" size={24} color={DARK} style={{marginTop: -26}} />
      {/*---------------------------------------- BUTTON ----------------------------------------*/}
      <View style={styles.submitBox}>
        <YellowButton onPress={onSubmit} label={'Confirm Locatoin'} />
      </View>

      {/* <TouchableHighlight onPress={onSubmit} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 20}}>Confirm</Text>
        </View>
      </TouchableHighlight> */}
    </View>
  );
};

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
  floatingButton: {
    position: 'absolute',
    zIndex: 9999,
    top: '41%',
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    padding: 7,
    borderRadius: 5,
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
