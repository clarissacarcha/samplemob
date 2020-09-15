/**
 * Displayed in Selected Delivery Details
 * Used to display driver information
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Linking,
  TouchableHighlight,
  Image,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import {COLOR, DARK, MEDIUM, ORANGE, LIGHT, COLOR_UNDERLAY, MAP_DELTA_LOW} from '../res/constants';
import {GET_DRIVER_LOCATION} from '../graphql';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FIcon from 'react-native-vector-icons/Fontisto';

const imageWidth = Dimensions.get('window').width - 40;

export const DriverLocationCard = ({driver}) => {
  const labels = ['Delivery', 'Tracking'];

  const navigation = useNavigation();

  const {data, loading, error} = useQuery(GET_DRIVER_LOCATION, {
    fetchPolicy: 'network-only',
    variables: {
      filter: {
        driverId: driver.id,
      },
    },
  });

  if (loading) {
    return (
      <View style={styles.card}>
        <View style={styles.cardShadow}>
          {/*------------------- RIDER INFO LABEL-------------------*/}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 20,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderColor: MEDIUM,
            }}>
            <FA5Icon name="map-marked" size={14} color={DARK} style={styles.iconBox} />
            <Text style={{marginLeft: 10, color: DARK, fontWeight: 'bold'}}>
              {labels[0]} <Text style={{color: ORANGE}}>{labels[1]}</Text>
            </Text>
          </View>
          <View style={{height: 150, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={24} color={COLOR} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardShadow}>
        {/*------------------- RIDER INFO LABEL-------------------*/}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: MEDIUM,
          }}>
          <FA5Icon name="map-marked" size={14} color={DARK} style={styles.iconBox} />
          <Text style={{marginLeft: 10, color: DARK, fontWeight: 'bold'}}>
            {labels[0]} <Text style={{color: ORANGE}}>{labels[1]}</Text>
          </Text>
        </View>
        <View style={{height: 150, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableHighlight
            style={{width: '100%'}}
            onPress={() =>
              navigation.push('DeliveryTracking', {
                data: {
                  latitude: data.getDriverLocation.latitude,
                  longitude: data.getDriverLocation.longitude,
                },
              })
            }>
            <View style={{height: 150}}>
              {/*---------------------------------------- MAP ----------------------------------------*/}
              <MapView
                provider={PROVIDER_GOOGLE}
                style={{flex: 1}}
                region={{
                  latitude: parseFloat(data.getDriverLocation.latitude),
                  longitude: parseFloat(data.getDriverLocation.longitude),
                  ...MAP_DELTA_LOW,
                }}
                scrollEnabled={false}
                rotateEnabled={false}
                zoomEnabled={false}>
                {/*---------------------------------------- PIN ----------------------------------------*/}
                {/* <Marker
                  coordinate={{
                    latitude: data.getDriverLocation.latitude,
                    longitude: data.getDriverLocation.longitude,
                  }}>
                  <FIcon name="motorcycle" size={24} color={COLOR} />
                </Marker> */}
              </MapView>
              {/*---------------------------------------- PIN ----------------------------------------*/}
              <View style={styles.floatingPin}>
                <FIcon name="motorcycle" size={24} color={COLOR} style={{marginTop: -24}} />
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginBottom: 20,
  },
  cardShadow: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    overflow: 'hidden',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionIconBox: {
    backgroundColor: DARK,
    height: 30,
    width: 30,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  iconBox: {
    backgroundColor: COLOR,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  iconBoxDark: {
    backgroundColor: DARK,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  floatingPin: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
