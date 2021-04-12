import React, {useState, useRef, useMemo, useEffect, useCallback} from 'react';
import {Text, View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import {throttle, debounce} from 'lodash';
import {useLazyQuery} from '@apollo/react-hooks';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {DARK, MEDIUM, ORANGE, onError, LIGHT, DIRTY_WHITE, COLOR} from '../../../../../res/constants';
import {WhiteButton, BlackButton} from '../../../../../revamp';
import {POST_DELIVERY} from '../../../../../graphql';

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// Region for Philippine Map
const PHILIPPINE_REGION = {
  latitude: 11.22309004847093,
  latitudeDelta: 19.887065883877668,
  longitude: 121.97818368673325,
  longitudeDelta: 10.145791545510278,
};

const StopDetails = ({navigation, route}) => {
  navigation.setOptions({
    headerShown: false,
  });

  const mapViewRef = useRef();

  const snapPoints = useMemo(() => [220], []);

  const orderData = route.params.orderData;

  const onMapReady = () => {
    const {northeast, southwest} = orderData.directions.bounds;

    const coordinates = [
      {
        ...northeast,
      },
      {
        ...southwest,
      },
    ];

    mapViewRef.current.fitToCoordinates(
      coordinates,
      {
        edgePadding: {
          right: 20,
          bottom: 100,
          left: 20,
          top: 50,
        },
      },
      3000,
    );
  };

  const onSubmit = () => {
    try {
      const input = orderData;

      delete input.directions;
      delete input.scheduledDate;
      delete input.isCashOnDelivery;
      delete input.pricing;
      delete input.price;
      delete input.distance;
      delete input.discount;
      delete input.duration;
      delete input.orderType;
      delete input.promoCode;
      delete input.isExpress;

      input.cashOnDelivery = parseFloat(bookingData.cashOnDelivery);
      input.referralCode = '';

      postDelivery({
        variables: {
          input,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.screenBox}>
      <MapView
        ref={mapViewRef}
        provider={PROVIDER_GOOGLE}
        style={styles.container}
        initialRegion={PHILIPPINE_REGION}
        onMapReady={onMapReady}
        // region={{
        //   // ...stopData,
        //   latitudeDelta: 0.015,
        //   longitudeDelta: 0.0121,
        // }}
        // onRegionChangeComplete={onMapScrollEnd}
      >
        {/*---------------------------------------- FOR CHECKING FLOATING PIN ACCURACY ----------------------------------------*/}
        {/* <Marker ref={markerRef} coordinate={stopData}>
            <FA5Icon name="map-pin" size={24} color="red" />
          </Marker> */}
        <Polyline
          coordinates={orderData.directions.legs[0].polyline}
          strokeColor="#FF0000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={3}
        />
      </MapView>
      <TouchableOpacity style={styles.back} onPress={() => navigation.pop()}>
        <MaterialIcon name="arrow-back" size={30} color={DARK} />
      </TouchableOpacity>
      <BottomSheet
        // ref={bottomSheetRef}
        index={0}
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
        )}
        // backdropComponent={BottomSheetBackdrop}
      >
        <View style={styles.sheet}>
          <Text style={{alignSelf: 'center'}}>Delivery Summary</Text>
          <View style={{flex: 1}} />
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcon name="map-marker-distance" size={16} color={COLOR} style={{marginHorizontal: 5}} />

              <Text>{orderData.distance} km</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcon name="clock-outline" size={16} color={COLOR} style={{marginHorizontal: 5}} />

              <Text>{orderData.duration} mins</Text>
            </View>
          </View>
          <View style={{flex: 1}} />
          <View
            style={{height: 60, borderWidth: 1, borderRadius: 5, borderColor: LIGHT, justifyContent: 'space-evenly'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcon name="circle-outline" size={10} color={COLOR} style={{marginHorizontal: 5}} />
              <Text numberOfLines={1} style={{fontSize: 12, flex: 1}}>
                {orderData.senderStop.formattedAddress}
              </Text>
            </View>
            <View style={{borderBottomWidth: 1, borderColor: DIRTY_WHITE, marginHorizontal: 10}} />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcon name="circle-outline" size={10} color={COLOR} style={{marginHorizontal: 5}} />
              <Text numberOfLines={1} style={{fontSize: 12, flex: 1}}>
                {orderData.recipientStop[0].formattedAddress}
              </Text>
            </View>
          </View>
          <View style={{flex: 1}} />
          <View style={styles.priceRow}>
            <Text style={{color: ORANGE, fontSize: 16}}>TOTAL</Text>
            <Text style={{color: ORANGE, fontSize: 16}}>₱ {orderData.price}.00</Text>
          </View>
          <View style={{height: 10}} />
          <BlackButton label="Book" onPress={() => {}} />
          <View style={{height: 10}} />
        </View>
      </BottomSheet>
    </View>
  );
};

export default StopDetails;

const styles = StyleSheet.create({
  screenBox: {
    backgroundColor: 'white',
    flex: 1,
  },
  sheet: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
  },
  back: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 40,
    width: 40,
    borderRadius: 20,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 210,
  },
  bottomSheetBox: {
    paddingHorizontal: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
