import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import {Location, Header, FrequentlyUsed, SavedLocations, SearchLocation} from './Sections';
import CONSTANTS from '../../../common/res/constants';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {GET_PLACE_AUTOCOMPLETE, GET_PLACE_BY_ID} from '../../graphql';
import {TOKTOK_QUOTATION_GRAPHQL_CLIENT} from 'src/graphql';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import {throttle, debounce} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {useDebounce} from '../../helpers';
import {ToktokgoBeta} from '../../components';

const ToktokGoSelectedLocations = ({navigation, route}) => {
  const {popTo} = route.params;
  const [selectedInput, setSelectedInput] = useState('D');
  const [searchResponse, setSearchResponse] = useState([]);

  const inputRef = useRef();
  const dispatch = useDispatch();
  const {origin, destination, sessionToken} = useSelector(state => state.toktokGo);

  const [searchDestination, setSearchDestination] = useState(destination.place.formattedAddress);
  const [searchOrigin, setSearchOrigin] = useState(origin.place.formattedAddress);

  const [getPlaceAutocomplete] = useLazyQuery(GET_PLACE_AUTOCOMPLETE, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setSearchResponse(response.getPlaceAutocomplete);
    },
    onError: error => console.log('getPlaceAutocomplete', error),
  });

  const [getPlaceById] = useLazyQuery(GET_PLACE_BY_ID, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      if (selectedInput == 'D') {
        dispatch({type: 'SET_TOKTOKGO_BOOKING_DESTINATION', payload: response.getPlaceById});
      } else {
        dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload: response.getPlaceById});
      }
      onPressLocation();
    },
    onError: error => console.log('error', error),
  });

  const debouncedRequest = useDebounce(
    value =>
      getPlaceAutocomplete({
        variables: {
          input: {
            searchString: value,
            sessionToken: sessionToken,
          },
        },
      }),
    1000,
  );

  const onChange = value => {
    setSearchDestination(value);
    debouncedRequest(value);
  };
  const onChangeOrigin = value => {
    setSearchOrigin(value);
    debouncedRequest(value);
  };

  const onPressLocation = () => {
    if (selectedInput == 'D') {
      navigation.pop();
      navigation.push('ToktokGoBookingConfirmDestination', {
        popTo: popTo + 1,
      });
    } else {
      navigation.pop();
      navigation.push('ToktokGoBookingConfirmPickup', {
        popTo: popTo + 1,
      });
    }
  };

  const onSelectPlace = value => {
    if (selectedInput == 'D') {
      setSearchDestination(value.formattedAddress);
    } else {
      setSearchOrigin(value.formattedAddress);
    }
    getPlaceById({
      variables: {
        input: {
          sessionToken: sessionToken,
          placeId: value.placeId,
          formattedAddress: value.formattedAddress,
        },
      },
    });
  };

  const onChangeSelectedInput = value => {
    setSelectedInput(value);
    if (value == 'D') {
      debouncedRequest(searchDestination);
    } else {
      debouncedRequest(searchOrigin);
    }
  };

  return (
    <View style={{backgroundColor: CONSTANTS.COLOR.WHITE, flex: 1, justifyContent: 'space-between'}}>
      <View>
        <Header navigation={navigation} />
        <Location
          onChangeOrigin={onChangeOrigin}
          onChange={onChange}
          inputRef={inputRef}
          selectedInput={selectedInput}
          onChangeSelectedInput={onChangeSelectedInput}
          titleOrigin={searchOrigin}
          title={searchDestination}
        />
        {searchResponse?.length == 0 ? (
          // <View>
          //   <FrequentlyUsed navigation={navigation} popTo={popTo} />
          //   <View style={{borderBottomWidth: 6, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />
          //   <SavedLocations />
          // </View>
          <ToktokgoBeta />
        ) : (
          <SearchLocation searchResponse={searchResponse} onSelectPlace={onSelectPlace} />
        )}
      </View>
      <TouchableHighlight
        onPress={() => {
          if (selectedInput == 'D') {
            navigation.pop();
            navigation.push('ToktokGoBookingConfirmDestination', {
              popTo: popTo + 1,
            });
          } else {
            navigation.pop();
            navigation.push('ToktokGoBookingConfirmPickup', {
              popTop: 1,
            });
          }
        }}>
        <View
          style={{
            paddingHorizontal: CONSTANTS.SIZE.MARGIN,
            width: '100%',
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 16,
            borderTopColor: '#ECECEC',
            borderTopWidth: 2,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {selectedInput == 'D' ? (
              <FA5Icon name="map-marker-alt" size={15} color={CONSTANTS.COLOR.ORANGE} style={{marginRight: 10}} />
            ) : (
              <FA5Icon name="map-pin" size={15} color={CONSTANTS.COLOR.YELLOW} style={{marginRight: 10}} />
            )}

            <Text
              style={{
                color: selectedInput == 'D' ? CONSTANTS.COLOR.ORANGE : CONSTANTS.COLOR.YELLOW,
                fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
                fontSize: CONSTANTS.FONT_SIZE.M,
              }}>
              Select via Map
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default ToktokGoSelectedLocations;
