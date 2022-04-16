import React, {useCallback} from 'react';
import {View, TouchableHighlight, Text, Image} from 'react-native';
import constants from '../../../common/res/constants';
import {useDispatch, useSelector} from 'react-redux';
import {Landing, SavedLocations, RecentDestinations, Header} from '../ToktokGoBookingStart/Sections';
import BookingDummyData from '../../components/BookingDummyData';
import {useFocusEffect} from '@react-navigation/native';
import {GET_PLACE_BY_ID} from '../../graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_QUOTATION_GRAPHQL_CLIENT} from '../../../graphql';
import uuid from 'react-native-uuid';
import {ToktokgoBeta} from '../../components';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import DestinationIcon from '../../../assets/icons/DestinationIcon.png';

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
    <View style={{flex: 1, backgroundColor: constants.COLOR.WHITE, justifyContent: 'space-between'}}>
      <View>
        <Header navigation={navigation} />
        <Landing navigation={navigation} />
        {/* <RecentDestinations navigation={navigation} />
        <View style={{borderBottomWidth: 6, borderBottomColor: constants.COLOR.LIGHT}} />
        <SavedLocations /> */}
        <ToktokgoBeta />
      </View>
      <TouchableHighlight
        onPress={() => {
          navigation.push('ToktokGoBookingConfirmDestination', {
            popTo: 1,
          });
        }}>
        <View
          style={{
            paddingHorizontal: constants.SIZE.MARGIN,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 16,
            borderTopColor: '#ECECEC',
            // borderTopWidth: 1,
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowRadius: 50,
            shadowOpacity: 1.0,
            elevation: 20,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <FA5Icon name="map-marker-alt" size={15} color={constants.COLOR.ORANGE} style={{marginRight: 10}} /> */}
            <Image source={DestinationIcon} style={{height: 20, width: 25, marginRight: 5}} resizeMode={'contain'} />

            <Text
              style={{
                color: constants.COLOR.ORANGE,
                fontFamily: constants.FONT_FAMILY.BOLD,
                fontSize: constants.FONT_SIZE.M,
              }}>
              Select via Map
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default ToktokGoBookingStart;
