import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import constants from '../../../common/res/constants';
import toktokgoSplash from '../../../assets/toktokgo/toktokgo-splash.png';
import {GET_TRIPS_CONSUMER} from '../../graphql/model/Trip';
import {TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {connect, useDispatch, useSelector} from 'react-redux';

const ToktokGoLanding = ({navigation, session}) => {
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
        if (response.getTripsConsumer[0]?.status == 'BOOKED' && response.getTripsConsumer[0]?.tag == 'ONGOING') {
          navigation.replace('ToktokGoFindingDriver', {
            popTo: 1,
            decodedPolyline: null,
            bookedData: response.getTripsConsumer[0],
          });
        } else {
          navigation.replace('ToktokGoHealthCare');
        }
      }, 3000);
    },
    onError: error => console.log('error', error),
  });

  const dispatchToSession = data => {
    dispatch({
      type: 'SET_TOKTOKGO_BOOKING_ORIGIN',
      payload: {place: data.route.origin},
    });
    dispatch({
      type: 'SET_TOKTOKGO_BOOKING_DESTINATION',
      payload: {place: data.route.destinations[0]},
    });
    dispatch({
      type: 'SET_TOKTOKGO_BOOKING_ROUTE',
      payload: {
        ...routeDetails,
        distance: data.route.distance,
        duration: data.route.duration,
        bounds: data.route.bounds,
        legs: data.route.legs,
      },
    });
  };

  const checkOngoingTrip = () => {
    getTripsConsumer({
      variables: {
        input: {
          consumerUserId: session.user.id,
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
      <Image source={toktokgoSplash} style={{width: 200, height: 200}} />
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(ToktokGoLanding);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: constants.COLOR.BACKGROUND_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
