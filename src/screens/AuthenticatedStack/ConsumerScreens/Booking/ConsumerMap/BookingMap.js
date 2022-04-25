import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {COLOR, DARK, LIGHT} from '../../../../../res/constants';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';

// Region for Philippine Map
const PHILIPPINE_REGION = {
  latitude: 11.22309004847093,
  latitudeDelta: 19.887065883877668,
  longitude: 121.97818368673325,
  longitudeDelta: 10.145791545510278,
};

const polylineCoordinates = [
  {
    latitude: 14.80867,
    longitude: 120.99354,
  },
  {
    latitude: 14.80866,
    longitude: 120.99385,
  },
  {
    latitude: 14.80865,
    longitude: 120.99388,
  },
  {
    latitude: 14.80864,
    longitude: 120.99406,
  },
  {
    latitude: 14.80862,
    longitude: 120.99425,
  },
  {
    latitude: 14.8086,
    longitude: 120.99437,
  },
  {
    latitude: 14.80857,
    longitude: 120.99462,
  },
  {
    latitude: 14.80854,
    longitude: 120.99485,
  },
  {
    latitude: 14.80849,
    longitude: 120.99517,
  },
  {
    latitude: 14.80848,
    longitude: 120.99534,
  },
  {
    latitude: 14.80848,
    longitude: 120.99534,
  },
  {
    latitude: 14.80861,
    longitude: 120.9954,
  },
  {
    latitude: 14.80871,
    longitude: 120.99544,
  },
  {
    latitude: 14.80877,
    longitude: 120.99547,
  },
  {
    latitude: 14.80883,
    longitude: 120.99549,
  },
  {
    latitude: 14.80887,
    longitude: 120.9955,
  },
  {
    latitude: 14.80891,
    longitude: 120.99551,
  },
  {
    latitude: 14.80895,
    longitude: 120.99552,
  },
  {
    latitude: 14.80898,
    longitude: 120.99552,
  },
  {
    latitude: 14.80904,
    longitude: 120.99552,
  },
  {
    latitude: 14.80909,
    longitude: 120.99552,
  },
  {
    latitude: 14.80912,
    longitude: 120.99552,
  },
  {
    latitude: 14.80916,
    longitude: 120.99553,
  },
  {
    latitude: 14.80919,
    longitude: 120.99553,
  },
  {
    latitude: 14.80921,
    longitude: 120.99554,
  },
  {
    latitude: 14.80924,
    longitude: 120.99555,
  },
  {
    latitude: 14.8093,
    longitude: 120.99556,
  },
  {
    latitude: 14.80937,
    longitude: 120.99558,
  },
  {
    latitude: 14.80942,
    longitude: 120.9956,
  },
  {
    latitude: 14.80948,
    longitude: 120.99562,
  },
  {
    latitude: 14.80954,
    longitude: 120.99564,
  },
  {
    latitude: 14.80961,
    longitude: 120.99565,
  },
  {
    latitude: 14.80969,
    longitude: 120.99566,
  },
  {
    latitude: 14.80974,
    longitude: 120.99567,
  },
  {
    latitude: 14.80979,
    longitude: 120.99569,
  },
  {
    latitude: 14.80984,
    longitude: 120.9957,
  },
  {
    latitude: 14.80988,
    longitude: 120.99572,
  },
  {
    latitude: 14.80989,
    longitude: 120.99572,
  },
  {
    latitude: 14.80993,
    longitude: 120.99574,
  },
  {
    latitude: 14.80997,
    longitude: 120.99577,
  },
  {
    latitude: 14.81,
    longitude: 120.9958,
  },
  {
    latitude: 14.81004,
    longitude: 120.99584,
  },
  {
    latitude: 14.81008,
    longitude: 120.99586,
  },
  {
    latitude: 14.81011,
    longitude: 120.99588,
  },
  {
    latitude: 14.81015,
    longitude: 120.9959,
  },
  {
    latitude: 14.81019,
    longitude: 120.99592,
  },
  {
    latitude: 14.81023,
    longitude: 120.99593,
  },
  {
    latitude: 14.81027,
    longitude: 120.99594,
  },
  {
    latitude: 14.81031,
    longitude: 120.99594,
  },
  {
    latitude: 14.81035,
    longitude: 120.99594,
  },
  {
    latitude: 14.81051,
    longitude: 120.99594,
  },
  {
    latitude: 14.81055,
    longitude: 120.99594,
  },
  {
    latitude: 14.81064,
    longitude: 120.99593,
  },
  {
    latitude: 14.81071,
    longitude: 120.99593,
  },
  {
    latitude: 14.81076,
    longitude: 120.99593,
  },
  {
    latitude: 14.8108,
    longitude: 120.99593,
  },
  {
    latitude: 14.81084,
    longitude: 120.99593,
  },
  {
    latitude: 14.81087,
    longitude: 120.99594,
  },
  {
    latitude: 14.81091,
    longitude: 120.99595,
  },
  {
    latitude: 14.811,
    longitude: 120.99599,
  },
  {
    latitude: 14.81117,
    longitude: 120.99609,
  },
  {
    latitude: 14.81125,
    longitude: 120.99614,
  },
  {
    latitude: 14.81132,
    longitude: 120.9962,
  },
  {
    latitude: 14.81138,
    longitude: 120.99625,
  },
  {
    latitude: 14.81144,
    longitude: 120.99631,
  },
  {
    latitude: 14.81148,
    longitude: 120.99635,
  },
  {
    latitude: 14.81152,
    longitude: 120.99639,
  },
  {
    latitude: 14.81154,
    longitude: 120.99644,
  },
  {
    latitude: 14.8116,
    longitude: 120.99652,
  },
  {
    latitude: 14.8116,
    longitude: 120.99652,
  },
  {
    latitude: 14.81173,
    longitude: 120.99668,
  },
  {
    latitude: 14.81177,
    longitude: 120.99672,
  },
  {
    latitude: 14.8118,
    longitude: 120.99675,
  },
  {
    latitude: 14.81186,
    longitude: 120.99679,
  },
  {
    latitude: 14.81191,
    longitude: 120.99682,
  },
  {
    latitude: 14.81198,
    longitude: 120.99685,
  },
  {
    latitude: 14.81205,
    longitude: 120.99689,
  },
  {
    latitude: 14.81213,
    longitude: 120.99694,
  },
  {
    latitude: 14.81218,
    longitude: 120.99697,
  },
  {
    latitude: 14.81223,
    longitude: 120.99699,
  },
  {
    latitude: 14.81229,
    longitude: 120.99701,
  },
  {
    latitude: 14.81235,
    longitude: 120.99702,
  },
  {
    latitude: 14.81255,
    longitude: 120.997,
  },
  {
    latitude: 14.81259,
    longitude: 120.99699,
  },
  {
    latitude: 14.81267,
    longitude: 120.99696,
  },
  {
    latitude: 14.8127,
    longitude: 120.99695,
  },
  {
    latitude: 14.81273,
    longitude: 120.99693,
  },
  {
    latitude: 14.81277,
    longitude: 120.99689,
  },
  {
    latitude: 14.81281,
    longitude: 120.99683,
  },
  {
    latitude: 14.81288,
    longitude: 120.99675,
  },
  {
    latitude: 14.81292,
    longitude: 120.99672,
  },
  {
    latitude: 14.81297,
    longitude: 120.99668,
  },
  {
    latitude: 14.81302,
    longitude: 120.99663,
  },
  {
    latitude: 14.81313,
    longitude: 120.99656,
  },
  {
    latitude: 14.81314,
    longitude: 120.99656,
  },
  {
    latitude: 14.8133,
    longitude: 120.99648,
  },
  {
    latitude: 14.81333,
    longitude: 120.99646,
  },
  {
    latitude: 14.81346,
    longitude: 120.99643,
  },
  {
    latitude: 14.81353,
    longitude: 120.9964,
  },
  {
    latitude: 14.81358,
    longitude: 120.99638,
  },
  {
    latitude: 14.81365,
    longitude: 120.99632,
  },
  {
    latitude: 14.81379,
    longitude: 120.99626,
  },
  {
    latitude: 14.81389,
    longitude: 120.99621,
  },
  {
    latitude: 14.81399,
    longitude: 120.99616,
  },
  {
    latitude: 14.81414,
    longitude: 120.99608,
  },
  {
    latitude: 14.8142,
    longitude: 120.99604,
  },
  {
    latitude: 14.81427,
    longitude: 120.996,
  },
  {
    latitude: 14.81433,
    longitude: 120.99595,
  },
  {
    latitude: 14.81441,
    longitude: 120.99586,
  },
  {
    latitude: 14.81447,
    longitude: 120.99578,
  },
  {
    latitude: 14.81457,
    longitude: 120.99567,
  },
  {
    latitude: 14.81459,
    longitude: 120.99564,
  },
  {
    latitude: 14.81463,
    longitude: 120.99559,
  },
  {
    latitude: 14.81465,
    longitude: 120.99551,
  },
  {
    latitude: 14.81468,
    longitude: 120.9954,
  },
  {
    latitude: 14.81472,
    longitude: 120.99527,
  },
  {
    latitude: 14.81477,
    longitude: 120.99515,
  },
  {
    latitude: 14.81482,
    longitude: 120.99501,
  },
  {
    latitude: 14.81485,
    longitude: 120.99481,
  },
  {
    latitude: 14.81494,
    longitude: 120.99461,
  },
  {
    latitude: 14.81508,
    longitude: 120.99437,
  },
  {
    latitude: 14.81512,
    longitude: 120.99431,
  },
  {
    latitude: 14.81515,
    longitude: 120.99426,
  },
  {
    latitude: 14.81518,
    longitude: 120.99423,
  },
  {
    latitude: 14.81521,
    longitude: 120.9942,
  },
  {
    latitude: 14.81525,
    longitude: 120.99417,
  },
  {
    latitude: 14.81529,
    longitude: 120.99415,
  },
  {
    latitude: 14.8153,
    longitude: 120.99415,
  },
  {
    latitude: 14.81534,
    longitude: 120.99415,
  },
  {
    latitude: 14.81537,
    longitude: 120.99415,
  },
  {
    latitude: 14.81541,
    longitude: 120.99416,
  },
  {
    latitude: 14.81543,
    longitude: 120.99417,
  },
  {
    latitude: 14.81544,
    longitude: 120.99418,
  },
  {
    latitude: 14.81547,
    longitude: 120.9942,
  },
  {
    latitude: 14.81552,
    longitude: 120.99424,
  },
  {
    latitude: 14.81557,
    longitude: 120.99427,
  },
  {
    latitude: 14.81562,
    longitude: 120.9943,
  },
  {
    latitude: 14.81567,
    longitude: 120.99432,
  },
  {
    latitude: 14.81573,
    longitude: 120.99434,
  },
  {
    latitude: 14.81582,
    longitude: 120.99435,
  },
  {
    latitude: 14.81586,
    longitude: 120.99436,
  },
  {
    latitude: 14.81589,
    longitude: 120.99436,
  },
  {
    latitude: 14.81592,
    longitude: 120.99436,
  },
  {
    latitude: 14.81594,
    longitude: 120.99436,
  },
  {
    latitude: 14.81595,
    longitude: 120.99435,
  },
  {
    latitude: 14.81596,
    longitude: 120.99433,
  },
  {
    latitude: 14.81596,
    longitude: 120.99433,
  },
  {
    latitude: 14.81598,
    longitude: 120.99431,
  },
  {
    latitude: 14.81599,
    longitude: 120.99427,
  },
  {
    latitude: 14.816,
    longitude: 120.99421,
  },
  {
    latitude: 14.81602,
    longitude: 120.99411,
  },
  {
    latitude: 14.81602,
    longitude: 120.99402,
  },
  {
    latitude: 14.81602,
    longitude: 120.994,
  },
  {
    latitude: 14.81603,
    longitude: 120.99387,
  },
  {
    latitude: 14.81604,
    longitude: 120.99385,
  },
  {
    latitude: 14.81604,
    longitude: 120.99383,
  },
  {
    latitude: 14.81605,
    longitude: 120.99377,
  },
  {
    latitude: 14.81607,
    longitude: 120.99373,
  },
  {
    latitude: 14.81609,
    longitude: 120.99368,
  },
  {
    latitude: 14.81611,
    longitude: 120.99364,
  },
  {
    latitude: 14.81614,
    longitude: 120.99361,
  },
  {
    latitude: 14.81617,
    longitude: 120.99359,
  },
  {
    latitude: 14.81621,
    longitude: 120.99357,
  },
  {
    latitude: 14.81623,
    longitude: 120.99357,
  },
  {
    latitude: 14.81624,
    longitude: 120.99357,
  },
  {
    latitude: 14.81625,
    longitude: 120.99357,
  },
  {
    latitude: 14.81632,
    longitude: 120.99358,
  },
  {
    latitude: 14.81647,
    longitude: 120.99359,
  },
  {
    latitude: 14.81654,
    longitude: 120.99359,
  },
  {
    latitude: 14.81661,
    longitude: 120.9936,
  },
  {
    latitude: 14.81663,
    longitude: 120.9936,
  },
  {
    latitude: 14.81669,
    longitude: 120.9936,
  },
  {
    latitude: 14.81672,
    longitude: 120.99359,
  },
  {
    latitude: 14.81677,
    longitude: 120.99359,
  },
  {
    latitude: 14.81677,
    longitude: 120.99359,
  },
  {
    latitude: 14.81678,
    longitude: 120.99361,
  },
  {
    latitude: 14.8168,
    longitude: 120.99364,
  },
  {
    latitude: 14.81682,
    longitude: 120.9937,
  },
  {
    latitude: 14.81684,
    longitude: 120.99376,
  },
  {
    latitude: 14.81686,
    longitude: 120.99381,
  },
  {
    latitude: 14.81686,
    longitude: 120.99382,
  },
  {
    latitude: 14.81687,
    longitude: 120.99384,
  },
  {
    latitude: 14.81688,
    longitude: 120.99387,
  },
  {
    latitude: 14.81686,
    longitude: 120.99403,
  },
  {
    latitude: 14.81686,
    longitude: 120.99405,
  },
  {
    latitude: 14.81685,
    longitude: 120.99407,
  },
  {
    latitude: 14.81686,
    longitude: 120.9941,
  },
  {
    latitude: 14.81687,
    longitude: 120.99414,
  },
  {
    latitude: 14.81693,
    longitude: 120.9942,
  },
  {
    latitude: 14.81697,
    longitude: 120.99425,
  },
  {
    latitude: 14.81707,
    longitude: 120.9943,
  },
  {
    latitude: 14.81716,
    longitude: 120.99435,
  },
  {
    latitude: 14.81727,
    longitude: 120.9944,
  },
  {
    latitude: 14.81743,
    longitude: 120.99445,
  },
  {
    latitude: 14.81755,
    longitude: 120.99446,
  },
  {
    latitude: 14.81759,
    longitude: 120.99447,
  },
  {
    latitude: 14.81786,
    longitude: 120.99447,
  },
  {
    latitude: 14.81796,
    longitude: 120.99447,
  },
  {
    latitude: 14.81806,
    longitude: 120.99448,
  },
  {
    latitude: 14.81818,
    longitude: 120.9945,
  },
  {
    latitude: 14.81838,
    longitude: 120.99455,
  },
  {
    latitude: 14.81853,
    longitude: 120.99458,
  },
  {
    latitude: 14.81861,
    longitude: 120.99459,
  },
  {
    latitude: 14.81866,
    longitude: 120.99459,
  },
  {
    latitude: 14.81869,
    longitude: 120.99458,
  },
  {
    latitude: 14.81873,
    longitude: 120.99457,
  },
  {
    latitude: 14.81876,
    longitude: 120.99455,
  },
  {
    latitude: 14.8188,
    longitude: 120.99453,
  },
  {
    latitude: 14.81892,
    longitude: 120.99442,
  },
  {
    latitude: 14.81913,
    longitude: 120.9943,
  },
  {
    latitude: 14.81939,
    longitude: 120.99425,
  },
  {
    latitude: 14.81946,
    longitude: 120.99423,
  },
  {
    latitude: 14.81949,
    longitude: 120.9942,
  },
  {
    latitude: 14.8195,
    longitude: 120.99417,
  },
  {
    latitude: 14.81951,
    longitude: 120.9941,
  },
  {
    latitude: 14.8195,
    longitude: 120.99405,
  },
  {
    latitude: 14.81949,
    longitude: 120.99398,
  },
  {
    latitude: 14.81948,
    longitude: 120.99388,
  },
  {
    latitude: 14.81949,
    longitude: 120.99383,
  },
  {
    latitude: 14.81951,
    longitude: 120.9938,
  },
  {
    latitude: 14.81952,
    longitude: 120.99379,
  },
  {
    latitude: 14.81952,
    longitude: 120.99379,
  },
  {
    latitude: 14.81953,
    longitude: 120.99378,
  },
  {
    latitude: 14.81956,
    longitude: 120.99376,
  },
  {
    latitude: 14.81959,
    longitude: 120.99375,
  },
  {
    latitude: 14.81963,
    longitude: 120.99373,
  },
  {
    latitude: 14.81975,
    longitude: 120.99367,
  },
  {
    latitude: 14.81989,
    longitude: 120.9936,
  },
  {
    latitude: 14.81996,
    longitude: 120.99358,
  },
  {
    latitude: 14.81996,
    longitude: 120.99358,
  },
  {
    latitude: 14.81996,
    longitude: 120.99357,
  },
  {
    latitude: 14.82001,
    longitude: 120.99358,
  },
  {
    latitude: 14.8201,
    longitude: 120.99361,
  },
  {
    latitude: 14.82011,
    longitude: 120.99362,
  },
  {
    latitude: 14.82016,
    longitude: 120.99364,
  },
  {
    latitude: 14.8202,
    longitude: 120.99366,
  },
  {
    latitude: 14.82027,
    longitude: 120.99366,
  },
  {
    latitude: 14.82051,
    longitude: 120.99364,
  },
  {
    latitude: 14.82094,
    longitude: 120.9936,
  },
  {
    latitude: 14.82124,
    longitude: 120.99356,
  },
  {
    latitude: 14.82158,
    longitude: 120.99351,
  },
  {
    latitude: 14.82179,
    longitude: 120.99348,
  },
  {
    latitude: 14.82251,
    longitude: 120.9933,
  },
  {
    latitude: 14.82264,
    longitude: 120.99328,
  },
  {
    latitude: 14.82268,
    longitude: 120.99327,
  },
  {
    latitude: 14.82277,
    longitude: 120.99326,
  },
  {
    latitude: 14.82314,
    longitude: 120.99313,
  },
];

const BookingMap = ({bookingData}) => {
  const {senderStop, recipientStop} = bookingData;
  const mapViewRef = useRef(null);

  //Use effect bookingRoute. animateToBounds
  // mapViewRef.current.fitToCoordinates(coordinates, {
  //   edgePadding: {
  //     right: 20,
  //     bottom: 350,
  //     left: 20,
  //     top: 100,
  //   },
  // });

  useEffect(() => {
    if (bookingData.directions) {
      const {northeast, southwest} = bookingData.directions.bounds;

      const coordinates = [
        {
          ...northeast,
        },
        {
          ...southwest,
        },
      ];

      console.log('DIRECTIONS DATA CHANGED');
      //Use effect bookingRoute. animateToBounds
      mapViewRef.current.fitToCoordinates(
        coordinates,
        {
          edgePadding: {
            right: 20,
            bottom: 200,
            left: 20,
            top: 100,
          },
        },
        3000,
      );
    }
  }, [bookingData]);

  const onMapReady = () => {
    if (senderStop.latitude) {
      mapViewRef.current.animateToRegion({
        latitude: senderStop.latitude,
        longitude: senderStop.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
    }
  };

  return (
    <MapView
      ref={mapViewRef}
      provider={PROVIDER_GOOGLE}
      // provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      style={styles.container}
      initialRegion={PHILIPPINE_REGION}
      onMapReady={onMapReady}>
      {/*---------------------------------------- SENDER MARKER ----------------------------------------*/}
      {senderStop.latitude !== null && (
        <Marker coordinate={{latitude: senderStop.latitude, longitude: senderStop.longitude}}>
          <FA5Icon name="map-pin" size={24} color={DARK} />
        </Marker>
      )}
      {/*---------------------------------------- RECIPIENT MARKER ----------------------------------------*/}
      {bookingData.directions && (
        <Marker
          coordinate={{
            latitude: bookingData.recipientStop[0].latitude,
            longitude: bookingData.recipientStop[0].longitude,
          }}>
          <FA5Icon name="map-marker-alt" size={24} color={DARK} />
        </Marker>
      )}
      {bookingData.directions && (
        <Polyline
          coordinates={bookingData.directions.legs[0].polyline}
          strokeColor="#FF0000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={3}
        />
      )}
    </MapView>
  );
};

const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

export default connect(mapStateToProps, null)(BookingMap);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9,
  },
  menuBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 20,
    borderRadius: 10,
  },
  branding: {
    position: 'absolute',
    top: 0,
    left: 70,
    marginTop: 20,
    borderRadius: 10,
  },
  brandingImage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 10,
  },
  menu: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    backgroundColor: DARK,
    borderRadius: 10,
  },
  taskBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 20,
    marginBottom: 0,
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
  iconBox: {
    backgroundColor: COLOR,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    overflow: 'hidden',
  },
  iconBoxDark: {
    backgroundColor: DARK,
    overflow: 'hidden',
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
  },
  directionsBox: {
    height: 50,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LIGHT,
    alignItems: 'center',
  },
  directionDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
