import React, {useCallback} from 'react';
import {View, TouchableHighlight, Text, Image} from 'react-native';
import constants from '../../../common/res/constants';
import {useDispatch} from 'react-redux';
import {Landing, Header} from '../ToktokGoBookingStart/Sections';
import {useFocusEffect} from '@react-navigation/native';
import {GET_PLACE_BY_LOCATION} from '../../graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_QUOTATION_GRAPHQL_CLIENT} from '../../../graphql';
import uuid from 'react-native-uuid';
import {ToktokgoBeta} from '../../components';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {currentLocation} from '../../../helper';
import DestinationIcon from '../../../assets/icons/DestinationIcon.png';

const ToktokGoBookingStart = ({navigation}) => {
  const dispatch = useDispatch();

  const setBookingInitialState = payload => {
    dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload});
  };

  const [getPlaceByLocation] = useLazyQuery(GET_PLACE_BY_LOCATION, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setBookingInitialState(response.getPlaceByLocation);
    },
    onError: error => console.log('error', error),
  });

  const setPlaceFunction = async () => {
    const {latitude, longitude} = await currentLocation({showsReverseGeocode: false});
    getPlaceByLocation({
      variables: {
        input: {
          location: {
            latitude: latitude,
            longitude: longitude,
          },
        },
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_SESSION_TOKEN', payload: uuid.v4()});
      dispatch({type: 'SET_TOKTOKGO_BOOKING_INITIAL_STATE'});
      setPlaceFunction();
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
