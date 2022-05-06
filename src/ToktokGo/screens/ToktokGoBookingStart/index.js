import React, {useCallback} from 'react';
import {View, TouchableHighlight, Text, Image} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import {connect, useDispatch} from 'react-redux';
import {Landing, Header} from './Sections';
import {useFocusEffect} from '@react-navigation/native';
import {GET_PLACE_BY_LOCATION} from '../../graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_QUOTATION_GRAPHQL_CLIENT} from '../../../graphql';
import {ToktokgoBeta, EmptyRecent} from '../../components';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {currentLocation} from '../../../helper';
import DestinationIcon from '../../../assets/icons/DestinationIcon.png';
import {ThrottledHighlight} from '../../../components_section';

const ToktokGoBookingStart = ({navigation, constants}) => {
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
      setPlaceFunction();
    }, [navigation]),
  );
  return (
    <View style={{flex: 1, backgroundColor: CONSTANTS.COLOR.WHITE, justifyContent: 'space-between'}}>
      <View>
        <Header navigation={navigation} constants={constants} />
        <Landing navigation={navigation} />
        {/* <RecentDestinations navigation={navigation} />
        <View style={{borderBottomWidth: 6, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />
        <SavedLocations /> */}
        {constants.iosVersionDisableBeta && Platform.OS == 'ios' ? <EmptyRecent /> : <ToktokgoBeta />}
      </View>
      <ThrottledHighlight
        delay={500}
        onPress={() => {
          navigation.push('ToktokGoBookingConfirmDestination', {
            popTo: 1,
          });
        }}>
        <View
          style={{
            paddingHorizontal: CONSTANTS.SIZE.MARGIN,
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
            {/* <FA5Icon name="map-marker-alt" size={15} color={CONSTANTS.COLOR.ORANGE} style={{marginRight: 10}} /> */}
            <Image source={DestinationIcon} style={{height: 20, width: 25, marginRight: 5}} resizeMode={'contain'} />

            <Text
              style={{
                color: CONSTANTS.COLOR.ORANGE,
                fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
                fontSize: CONSTANTS.FONT_SIZE.M,
              }}>
              Select via Map
            </Text>
          </View>
        </View>
      </ThrottledHighlight>
    </View>
  );
};

const mapStateToProps = state => ({
  constants: state.constants,
});

export default connect(mapStateToProps, null)(ToktokGoBookingStart);
