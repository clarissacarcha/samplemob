import React, {useState, useRef, useMemo, useEffect, useCallback} from 'react';
import {Text, View, TextInput, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import {useMutation, useQuery} from '@apollo/react-hooks';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {DARK, MEDIUM, ORANGE, LIGHT, DIRTY_WHITE, FONT_REGULAR, FONT_MEDIUM} from '../../../../../res/constants';
import {FONT_SIZE, FONT, SIZE, COLOR} from '../../../../../res/variables';
import {BlackButton, VectorIcon, ICON_SET, Shadow, YellowButton} from '../../../../../revamp';
import {AlertOverlay} from '../../../../../components';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {POST_DELIVERY} from '../../../../../graphql';
import {onErrorAlert} from '../../../../../util/ErrorUtility';
import {useAlert} from '../../../../../hooks';

//SELF IMPORTS
import LoadingSuccessOverlay from './LoadingSuccessOverlay';

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

  const AlertHook = useAlert();
  const mapViewRef = useRef();

  const snapPoints = useMemo(() => [280], []);

  const [orderData, setOrderData] = useState(route.params.orderData);

  const [booked, setBooked] = useState(false);

  const [postDelivery, {loading: postDeliveryLoading}] = useMutation(POST_DELIVERY, {
    onError: error => {
      onErrorAlert({alert: AlertHook, error});
    },
    onCompleted: () => {
      try {
        setBooked(true);
      } catch (error) {}
    },
  });

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

    console.log({LALA: coordinates});

    mapViewRef.current.fitToCoordinates(
      coordinates,
      {
        edgePadding: {
          right: 20,
          bottom: 140,
          left: 20,
          top: 90,
        },
      },
      3000,
    );
  };

  const onBookNow = () => {
    try {
      const input = {...orderData};

      delete input.directions;
      delete input.scheduledDate;
      delete input.scheduledAt;
      delete input.itemDescription; // Item Description is cargo in postDeliveryInput
      delete input.isCashOnDelivery;
      delete input.pricing;
      delete input.price;
      delete input.distance;
      delete input.discount;
      delete input.duration;
      delete input.orderType;
      delete input.promoCode;
      delete input.isExpress;
      delete input.vehicleTypeId;

      input.cashOnDelivery = parseFloat(input.cashOnDelivery);
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

  const onSuccessOkay = () => {
    setBooked(false);
    // navigation.pop(3);
    navigation.replace('RootDrawer', {
      screen: 'AuthenticatedStack',
      params: {
        screen: 'ConsumerLanding',
      },
    });
  };

  return (
    <View style={styles.screenBox}>
      <LoadingSuccessOverlay visible={booked} done={booked} onOkay={onSuccessOkay} />
      {/* <LoadingSuccessOverlay visible={true} done={true} onOkay={onSuccessOkay} /> */}
      <AlertOverlay visible={postDeliveryLoading} />
      <MapView
        ref={mapViewRef}
        provider={PROVIDER_GOOGLE}
        style={styles.container}
        initialRegion={PHILIPPINE_REGION}
        // onMapReady={onMapReady}
        onLayout={onMapReady}
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

        {orderData.directions && (
          <>
            <Marker coordinate={{latitude: orderData.senderStop.latitude, longitude: orderData.senderStop.longitude}}>
              <VectorIcon iconSet={ICON_SET.FontAwesome5} name="map-pin" size={24} color={COLOR.YELLOW} />
            </Marker>
            <Marker
              coordinate={{
                latitude: orderData.recipientStop[0].latitude,
                longitude: orderData.recipientStop[0].longitude,
              }}>
              <VectorIcon iconSet={ICON_SET.FontAwesome5} name="map-marker-alt" size={24} color={COLOR.ORANGE} />
            </Marker>
          </>
        )}

        {orderData.directions.legs && (
          <Polyline
            coordinates={orderData.directions.legs[0].polyline}
            strokeColor="#FF0000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={3}
          />
        )}
      </MapView>
      <Shadow style={styles.back}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <View
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <VectorIcon iconSet={ICON_SET.Entypo} name="chevron-thin-left" size={20} />
          </View>
        </TouchableOpacity>
      </Shadow>

      <BottomSheet
        // ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        handleComponent={() => (
          <View
            style={{
              height: 16,
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
          <Text style={{alignSelf: 'center', fontFamily: FONT.BOLD, marginBottom: 8}}>Delivery Summary</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 8, marginHorizontal: 50}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <VectorIcon
                iconSet={ICON_SET.Feather}
                name="map"
                color={COLOR.YELLOW}
                size={16}
                style={{marginHorizontal: 5}}
              />
              <Text style={{}}>{orderData.distance} km</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcon
                name="clock-outline"
                size={16}
                color={COLOR.YELLOW}
                style={{marginHorizontal: 5}}
              />

              <Text style={{}}>{orderData.duration} mins</Text>
            </View>
          </View>
          <View style={{height: 8, backgroundColor: COLOR.LIGHT}} />
          <View style={{height: 100, marginHorizontal: SIZE.MARGIN, flexDirection: 'row'}}>
            <View style={{width: 50, alignItems: 'center', marginVertical: 12}}>
              <VectorIcon iconSet={ICON_SET.FontAwesome5} name="map-pin" color={COLOR.YELLOW} size={16} />
              <View
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  marginVertical: 3,
                }}>
                <View style={{height: 3, width: 3, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
                <View style={{height: 3, width: 3, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
                <View style={{height: 3, width: 3, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
                <View style={{height: 3, width: 3, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
                <View style={{height: 3, width: 3, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
                <View style={{height: 3, width: 3, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
                <View style={{height: 3, width: 3, backgroundColor: COLOR.MEDIUM, borderRadius: 4, marginBottom: 4}} />
              </View>
              <VectorIcon iconSet={ICON_SET.FontAwesome5} name="map-marker-alt" color={COLOR.ORANGE} size={16} />
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text numberOfLines={1} style={{fontFamily: FONT.BOLD}}>
                  {orderData.senderStop.name}
                </Text>
                <Text numberOfLines={1} style={{}}>
                  {orderData.senderStop.formattedAddress}
                </Text>
              </View>
              <View style={{borderBottomWidth: 1, borderColor: DIRTY_WHITE, marginHorizontal: 10}} />
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text numberOfLines={1} style={{fontFamily: FONT.BOLD}}>
                  {orderData.recipientStop[0].name}
                </Text>
                <Text numberOfLines={1} style={{}}>
                  {orderData.recipientStop[0].formattedAddress}
                </Text>
              </View>
            </View>
          </View>
          <View style={{height: 8, backgroundColor: COLOR.LIGHT, marginBottom: 8}} />
          <View style={styles.priceRow}>
            <Text style={{color: COLOR.ORANGE, fontSize: FONT_SIZE.L, fontFamily: FONT.BOLD}}>TOTAL</Text>
            <Text style={{color: COLOR.ORANGE, fontSize: FONT_SIZE.L, fontFamily: FONT.BOLD}}>
              PHP {orderData.price}.00
            </Text>
          </View>
          <View style={{margin: 16}}>
            <YellowButton label="Book Now" onPress={onBookNow} />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export const DeliverySummary = StopDetails;

const styles = StyleSheet.create({
  screenBox: {
    backgroundColor: 'white',
    flex: 1,
  },
  sheet: {
    flex: 1,
    // paddingHorizontal: 10,
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
    marginTop: StatusBar.currentHeight,
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
    marginHorizontal: 16,
  },
});
