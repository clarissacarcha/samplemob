import React, {useRef, useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector, useDispatch} from 'react-redux';
import {COLOR, DARK, MEDIUM, LIGHT, MAP_DELTA_LOW} from '../../../../res/constants';

import {GET_PLACE_BY_LOCATION} from '../../../graphql';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_QUOTATION_GRAPHQL_CLIENT} from 'src/graphql';
import {number} from 'prop-types';
export const DestinationMap = ({onDragEndMarker, mapRegion}) => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{height: '90%', width: '100%'}}
        initialRegion={{...mapRegion}}
        onRegionChangeComplete={e => {
          onDragEndMarker(e);
        }}></MapView>
      <View style={{alignItems: 'center', zIndex: 999, alignContent: 'center', position: 'absolute'}}>
        <FA5Icon name="map-marker-alt" size={20} color={CONSTANTS.COLOR.ORANGE} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject,
    // position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CONSTANTS.COLOR.WHITE,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 4,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  originLocation: {
    backgroundColor: CONSTANTS.COLOR.WHITE,
    marginBottom: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
});
