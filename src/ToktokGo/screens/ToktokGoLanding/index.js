import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View, Platform} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import toktokgoSplashBeta from '../../../assets/toktokgo/toktokgo-splash.png';
import toktokgoSplash from '../../../assets/toktokgo/toktokgo-splash-improved.png';
import {GO_GET_TRIPS_CONSUMER} from '../../graphql/model/Trip';
import {TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {connect, useDispatch, useSelector} from 'react-redux';
import {decodeLegsPolyline} from '../../helpers';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {onErrorAppSync} from '../../util';
import {useAccount} from 'toktokwallet/hooks';
import {useAlertGO} from '../../hooks';

const ToktokGoLanding = ({navigation, session, route, constants}) => {
  const dispatch = useDispatch();
  const {bookingId, action, voucherData} = route?.params ? route.params : {bookingId: null, action: null};
  const {routeDetails} = useSelector(state => state.toktokGo);
  const {tokwaAccount, getMyAccount} = useAccount();

  const currentBookingActions = ['ACCEPTED', 'ARRIVED', 'PICKED_UP', 'COMPLETED'];
  const bookingDetailsActions = ['CANCELLED', 'EXPIRED'];
  const alertGO = useAlertGO();

  useEffect(() => {
    if (session.user.toktokWalletAccountId) {
      getMyAccount();
    }
  }, []);

  const [getTripsConsumer] = useLazyQuery(GO_GET_TRIPS_CONSUMER, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      if (response.goGetTripsConsumer.length > 0) {
        dispatchToSession(response.goGetTripsConsumer[0]);

        setTimeout(() => {
          console.log('HERE:', response.goGetTripsConsumer[0]?.status);
          if (
            response.goGetTripsConsumer[0]?.tag == 'ONGOING' &&
            ['BOOKED', 'DISPATCHED', 'REQUESTED'].includes(response.goGetTripsConsumer[0]?.status)
          ) {
            const decodedPolyline = decodeLegsPolyline(response.goGetTripsConsumer[0]?.route.legs);
            navigation.replace('ToktokGoFindingDriver', {
              popTo: 1,
              decodedPolyline,
            });
            checkNotificationToNavigate({trip: response.goGetTripsConsumer[0]});
          } else if (
            response.getTripsConsumer[0]?.tag == 'ONGOING' &&
            ['ACCEPTED', 'ARRIVED', 'PICKED_UP'].includes(response.goGetTripsConsumer[0]?.status)
          ) {
            const decodedPolyline = decodeLegsPolyline(response.goGetTripsConsumer[0]?.route.legs);
            navigation.replace('ToktokGoOnTheWayRoute', {
              popTo: 1,
              decodedPolyline,
            });
            checkNotificationToNavigate({trip: response.goGetTripsConsumer[0]});
          } else {
            healthCareAccept();
          }
        }, 1000);
      } else {
        healthCareAccept();
      }
    },
    onError: error => {
      const {graphQLErrors, networkError} = error;
      console.log(graphQLErrors);
      if (networkError) {
        alertGO({message: 'Network error occurred. Please check your internet connection.'});
      } else if (graphQLErrors.length > 0) {
        navigation.replace('ToktokGoMaintance');
      }
    },
  });

  const checkNotificationToNavigate = ({trip}) => {
    console.log('action:', action, 'bookingId:', bookingId);
    if (currentBookingActions.includes(action)) {
      if (trip.id != bookingId) {
        navigation.push('SelectedBookingDetails', {
          bookingId,
        });
      }
    }
    if (bookingDetailsActions.includes(action)) {
      navigation.push('SelectedBookingDetails', {
        bookingId,
      });
    }
  };

  const healthCareAccept = async () => {
    const date = await AsyncStorage.getItem('ToktokGoHealthCare');
    const data = await AsyncStorage.getItem('ToktokGoOnBoardingBeta');

    if (data) {
      if (date === moment(new Date()).format('MMM D, YYYY')) {
        if (constants.show1022GoRates == 1) {
          navigation.replace('ToktokGoNewGuidelines', {voucherData});
        } else {
          navigation.replace('ToktokGoBookingStart', {voucherData});
          checkNotificationToNavigate({trip: null});
        }
      } else if (!session.user.toktokWalletAccountId) {
        navigation.replace('ToktokGoCreateTokwa', {voucherData});
      } else {
        navigation.replace('ToktokGoHealthCare', {voucherData});
      }
    } else {
      navigation.replace('ToktokGoOnBoardingBeta', {voucherData});
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
