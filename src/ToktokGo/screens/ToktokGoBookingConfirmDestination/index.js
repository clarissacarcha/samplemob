import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, StatusBar, TouchableOpacity, Image} from 'react-native';
import {DestinationMap, ConfirmDestinationButton} from './Sections';
import constants from '../../../common/res/constants';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {GET_PLACE_BY_LOCATION} from '../../graphql';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_QUOTATION_CLIENT} from 'src/graphql';

const ToktokGoBookingConfirmDestination = ({navigation, route}) => {
  const {destination} = useSelector(state => state.toktokGo);
  const {popTo} = route.params;
  const dispatch = useDispatch();

  const onConfirm = () => {
    navigation.push('ToktokGoBookingConfirmPickup', {
      popTo: popTo + 1,
    });
  };

  const [getPlaceByLocation] = useLazyQuery(GET_PLACE_BY_LOCATION, {
    client: TOKTOK_QUOTATION_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      console.log('getPlaceByLocation', response);
      dispatch({type: 'SET_TOKTOKGO_BOOKING_DESTINATION', payload: response.getPlaceByLocation});
    },
    onError: error => console.log('error', error),
  });
  const onDragEndMarker = e => {
    console.log(e);
    getPlaceByLocation({
      variables: {
        input: {
          location: e,
        },
      },
    });
  };

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop()}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </TouchableOpacity>
      <DestinationMap onDragEndMarker={onDragEndMarker} />
      <View style={styles.card}>
        <View style={{flexDirection: 'row', textAlign: 'center'}}>
          <FA5Icon name="map-marker-alt" size={20} color={constants.COLOR.ORANGE} style={{marginRight: 10}} />
          <Text>{destination.place.formattedAddress}</Text>
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
    borderWidth: 3,
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
