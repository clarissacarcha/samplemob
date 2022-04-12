import React, {useCallback} from 'react';
import {View} from 'react-native';
import constants from '../../../common/res/constants';
import {useDispatch, useSelector} from 'react-redux';
import {Landing, SavedLocations, RecentDestinations, Header} from '../ToktokGoBookingStart/Sections';
import BookingDummyData from '../../components/BookingDummyData';
import {useFocusEffect} from '@react-navigation/native';
import {GET_PLACE_BY_ID} from '../../graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_QUOTATION_GRAPHQL_CLIENT} from '../../../graphql';
import uuid from 'react-native-uuid';

const ToktokGoBookingStart = ({navigation}) => {
  const dispatch = useDispatch();

  const {origin, sessionToken} = useSelector(state => state.toktokGo);

  const setBookingInitialState = payload => {
    dispatch({type: 'SET_TOKTOKGO_BOOKING_INITIAL_STATE'});
    dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload});
  };

  const [getPlaceById] = useLazyQuery(GET_PLACE_BY_ID, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setBookingInitialState(response.getPlaceById);
    },
    onError: error => console.log('error', error),
  });

  useFocusEffect(
    useCallback(() => {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_SESSION_TOKEN', payload: uuid.v4()});
      getPlaceById({
        variables: {
          input: {
            sessionToken: sessionToken,
            placeId: BookingDummyData.pickupLocation.placeId,
            formattedAddress: BookingDummyData.pickupLocation.formattedAddress,
          },
        },
      });
    }, [navigation]),
  );
  return (
    <View style={{flex: 1, backgroundColor: constants.COLOR.WHITE}}>
      <View>
        <Header navigation={navigation} />
        <Landing navigation={navigation} />
        <RecentDestinations navigation={navigation} />
        <View style={{borderBottomWidth: 6, borderBottomColor: constants.COLOR.LIGHT}} />
        <SavedLocations />
      </View>
    </View>
  );
};

export default ToktokGoBookingStart;
