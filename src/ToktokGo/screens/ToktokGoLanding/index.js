import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View, Platform} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import toktokgoSplashBeta from '../../../assets/toktokgo/toktokgo-splash.png';
import toktokgoSplash from '../../../assets/toktokgo/toktokgo-splash-improved.png';
import {GET_TRIPS_CONSUMER} from '../../graphql/model/Trip';
import {TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {connect, useDispatch, useSelector} from 'react-redux';
import {decodeLegsPolyline} from '../../helpers';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {onErrorAppSync} from '../../util';

const ToktokGoLanding = ({navigation, session, constants}) => {
  const dispatch = useDispatch();
  const {routeDetails} = useSelector(state => state.toktokGo);
  const [getTripsConsumer] = useLazyQuery(GET_TRIPS_CONSUMER, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      if (response.getTripsConsumer.length > 0) {
        dispatchToSession(response.getTripsConsumer[0]);
      }
      setTimeout(() => {
        console.log('HERE:', response.getTripsConsumer[0]?.status);
        if (
          response.getTripsConsumer[0]?.tag == 'ONGOING' &&
          ['BOOKED', 'DISPATCHED'].includes(response.getTripsConsumer[0]?.status)
        ) {
          const decodedPolyline = decodeLegsPolyline(response.getTripsConsumer[0]?.route.legs);
          navigation.replace('ToktokGoFindingDriver', {
            popTo: 1,
            decodedPolyline,
          });
        } else if (
          response.getTripsConsumer[0]?.tag == 'ONGOING' &&
          ['ACCEPTED', 'ARRIVED', 'PICKED_UP'].includes(response.getTripsConsumer[0]?.status)
        ) {
          const decodedPolyline = decodeLegsPolyline(response.getTripsConsumer[0]?.route.legs);
          navigation.replace('ToktokGoOnTheWayRoute', {
            popTo: 1,
            decodedPolyline,
          });
        } else {
          healthCareAccept();
        }
      }, 1000);
    },
    onError: onErrorAppSync,
  });

  const healthCareAccept = async () => {
    const date = await AsyncStorage.getItem('ToktokGoHealthCare');
    if (date === moment(new Date()).format('MMM D, YYYY')) {
      navigation.replace('ToktokGoBookingStart');
    } else {
      navigation.replace('ToktokGoHealthCare');
    }
  };

  const dispatchToSession = data => {
    console.log(data);
    dispatch({
      type: 'SET_TOKTOKGO_BOOKING',
      payload: data,
    });
  };

  const checkOngoingTrip = () => {
    getTripsConsumer({
      variables: {
        input: {
          tag: 'ONGOING',
        },
      },
    });
  };

  useEffect(() => {
    checkOngoingTrip();
    // navigation.replace('ToktokGoHealthCare');
  }, []);

  return (
    <View style={styles.content}>
      <Image source={toktokgoSplashBeta} style={{width: 200, height: 200}} resizeMode={'contain'} />
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

export default connect(mapStateToProps, null)(ToktokGoLanding);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: CONSTANTS.COLOR.BACKGROUND_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
