import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import constants from '../../../common/res/constants';
import toktokgoSplash from '../../../assets/toktokgo/toktokgo-splash.png';
import {GET_TRIPS_CONSUMER} from '../../graphql/model/Trip';
import {TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {connect, useDispatch, useSelector} from 'react-redux';
import {decodeLegsPolyline} from '../../helpers';

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
          navigation.push('ToktokGoOnTheWayRoute', {
            popTo: 1,
            decodedPolyline,
          });
        } else {
          navigation.replace('ToktokGoHealthCare');
        }
      }, 3000);
    },
    onError: error => console.log('error', error),
  });

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
