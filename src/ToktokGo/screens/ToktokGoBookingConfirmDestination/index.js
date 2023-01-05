import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, StatusBar, TouchableOpacity, Image, Dimensions} from 'react-native';
import {DestinationMap, ConfirmDestinationButton} from './Sections';
import constants from '../../../common/res/constants';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {GET_PLACE_BY_LOCATION} from '../../graphql';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_QUOTATION_GRAPHQL_CLIENT} from 'src/graphql';
import {MAP_DELTA_LOW} from '../../../res/constants';
import {useDebounce} from '../../helpers';
import {throttle} from 'lodash';
import {onError} from '../../../util/ErrorUtility';
import DestinationIcon from '../../../assets/icons/DestinationIcon.png';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const screenWidth = Dimensions.get('window').width;

const ToktokGoBookingConfirmDestination = ({navigation, route}) => {
  const {destination, origin} = useSelector(state => state.toktokGo);
  const {popTo} = route.params;
  const [initialRegionChange, setInitialRegionChange] = useState(true);
  const dispatch = useDispatch();
  const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
  const onConfirm = throttle(
    () => {
      if (data?.getPlaceByLocation) {
        dispatch({type: 'SET_TOKTOKGO_BOOKING_DESTINATION', payload: data?.getPlaceByLocation});
      }
      navigation.pop(popTo);
      navigation.push('ToktokGoBookingConfirmPickup', {
        popTo: popTo + 1,
      });
    },
    1000,
    {trailing: false},
  );

  const [mapRegion, setMapRegion] = useState(
    destination?.place?.location?.latitude
      ? {...destination.place.location, ...MAP_DELTA_LOW}
      : {...origin.place.location, ...MAP_DELTA_LOW},
  );

  const [getPlaceByLocation, {data, loading}] = useLazyQuery(GET_PLACE_BY_LOCATION, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_DESTINATION', payload: data.getPlaceByLocation});
    },
    onError: onError,
  });

  const debouncedRequest = useDebounce(
    value =>
      getPlaceByLocation({
        variables: {
          input: {
            location: {
              latitude: value.latitude,
              longitude: value.longitude,
            },
          },
        },
      }),
    1000,
  );

  const onDragEndMarker = e => {
    if (!initialRegionChange) {
      setMapRegion(e);
      debouncedRequest(e);
    }
    setInitialRegionChange(false);
  };

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop()}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </TouchableOpacity>
      {mapRegion ? <DestinationMap onDragEndMarker={onDragEndMarker} mapRegion={mapRegion} /> : <></>}
      <View style={styles.card}>
        <View
          style={{
            borderRadius: 5,
            backgroundColor: constants.COLOR.LIGHT,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 10,
              marginVertical: 10,
              textAlign: 'center',
            }}>
            <Image source={DestinationIcon} style={{height: 20, width: 25, marginRight: 5}} resizeMode={'contain'} />
            <ShimmerPlaceHolder
              style={[{width: screenWidth / 1.08, marginBottom: !loading ? 0 : 18}, loading ? {height: 30} : {}]}
              visible={!loading}>
              <Text style={{paddingRight: 30}}>
                {destination?.place?.formattedAddress
                  ? destination.place.formattedAddress
                  : origin.place.formattedAddress}
              </Text>
            </ShimmerPlaceHolder>
          </View>
        </View>
        <ConfirmDestinationButton onConfirm={onConfirm} />
      </View>
    </View>
  );
};

export default ToktokGoBookingConfirmDestination;

const styles = StyleSheet.create({
  card: {
    right: -4.5,
    width: '102%',
    borderWidth: 4,
    borderTopColor: constants.COLOR.ORANGE,
    borderLeftColor: constants.COLOR.ORANGE,
    borderRightColor: constants.COLOR.ORANGE,
    borderBottomColor: constants.COLOR.WHITE,
    position: 'absolute',
    paddingTop: 13,
    paddingHorizontal: 16,
    bottom: 0,
    // zIndex: 999,
    backgroundColor: constants.COLOR.WHITE,
    // marginTop: 8,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: constants.COLOR.LIGHT,
    marginVertical: 16,
    marginHorizontal: -16,
  },
  iconDimensions: {
    width: 10,
    height: 15,
  },
  backButton: {
    zIndex: 999,
    backgroundColor: constants.COLOR.WHITE,
    position: 'absolute',
    top: StatusBar.currentHeight + 23,
    left: 16,
    padding: 6,
    borderRadius: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
