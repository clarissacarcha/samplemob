import React, {useState, useEffect, useRef} from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import {Location, Header, FrequentlyUsed, SavedLocations} from './Sections';
import CONSTANTS from '../../../common/res/constants';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {GET_PLACE_AUTOCOMPLETE, GET_PLACE_BY_LOCATION} from '../../graphql';
import {TOKTOK_QUOTATION_CLIENT} from 'src/graphql';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import uuid from 'react-native-uuid';
import {throttle, debounce} from 'lodash';

const ToktokGoSelectedLocations = ({navigation}) => {
  const [sessionToken, setSessionToken] = useState(uuid.v4());
  const [searchString, setSearchString] = useState('');
  const inputRef = useRef();
  console.log('nor', sessionToken);

  const [getPlaceAutocomplete] = useLazyQuery(GET_PLACE_AUTOCOMPLETE, {
    client: TOKTOK_QUOTATION_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      console.log(response);
    },
    onError: error => console.log('getPlaceAutocomplete', error),
  });

  const [getPlaceByLocation] = useLazyQuery(GET_PLACE_BY_LOCATION, {
    client: TOKTOK_QUOTATION_CLIENT,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        location: {
          longitude: 121.0267258,
          latitude: 14.5374469,
        },
      },
    },
    onCompleted: response => {
      console.log(response);
    },
    onError: error => console.log('error', error),
  });

  useEffect(() => {
    // getPlaceByLocation();
    getPlaceAutocomplete({
      variables: {
        input: {
          searchString: searchString,
          sessionToken: sessionToken,
        },
      },
    });
  }, [searchString, sessionToken]);

  const onChange = value => {
    setSearchString(value);
  };

  return (
    <View style={{backgroundColor: CONSTANTS.COLOR.WHITE, flex: 1, justifyContent: 'space-between'}}>
      <View>
        <Header navigation={navigation} />
        <Location onChange={debounce(onChange, 1000)} inputRef={inputRef} />
        <FrequentlyUsed />
        <View style={{borderBottomWidth: 6, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />
        <SavedLocations />
      </View>
      <TouchableHighlight onPress={() => console.log('trigger')}>
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
            <FA5Icon name="map-marker-alt" size={15} color={CONSTANTS.COLOR.ORANGE} style={{marginRight: 10}} />
            <Text style={{color: '#F6841F', fontFamily: CONSTANTS.FONT_FAMILY.BOLD, fontSize: CONSTANTS.FONT_SIZE.M}}>
              Select via Map
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default ToktokGoSelectedLocations;
