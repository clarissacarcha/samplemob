import React, {useState, useRef, useEffect, useCallback} from 'react';
import {Text, View, TextInput, StyleSheet, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle, debounce} from 'lodash';
import {useLazyQuery} from '@apollo/react-hooks';
import uuid from 'react-native-uuid';
import {GET_GOOGLE_PLACE_DETAILS} from '../../../../../graphql';
import {WhiteButton, TouchableIcon} from '../../../../../revamp';
import {LIGHT, DIRTY_WHITE} from '../../../../../res/constants';

const ItemSeparator = () => <View style={styles.separator} />;

const AutocompleteResult = ({searchResult, sessionToken, setSessionToken, onLocationSelect, setSearchText}) => {
  const navigation = useNavigation();

  const [selectedFormattedAddress, setSelectedFormattedAddress] = useState('');

  const [getGooglePlaceDetails, {loading}] = useLazyQuery(GET_GOOGLE_PLACE_DETAILS, {
    fetchPolicy: 'network-only',
    onCompleted: data => {
      console.log({result: data.getGooglePlaceDetails.location});
      setSessionToken(uuid.v4()); // Use new sessionToken after Place Details Request
      onLocationSelect({
        location: data.getGooglePlaceDetails.location,
        addressBreakdownHash: data.getGooglePlaceDetails.addressBreakdownHash,
        formattedAddress: selectedFormattedAddress,
      });

      // navigation.setOptions({
      //   headerShown: false,
      // });
    },
  });

  const onResultSelect = ({prediction}) => {
    setSelectedFormattedAddress(prediction.formattedAddress);
    getGooglePlaceDetails({
      variables: {
        input: {
          placeId: prediction.placeId,
          sessionToken: sessionToken,
        },
      },
    });

    // navigation.push('StopDetails');
  };

  const onPredictionSelect = async prediction => {
    console.log({prediction});
    setText(prediction.formattedAddress);
    setResult(INITIAL_RESULT);
    getGooglePlaceDetails({
      variables: {
        input: {
          placeId: prediction.placeId,
          sessionToken: sessionToken,
        },
      },
    });
  };

  const renderItem = ({item}) => {
    const formattedAddressParts = item.formattedAddress.split(',');

    return (
      <WhiteButton
        label={formattedAddressParts[0]}
        description={item.formattedAddress}
        prefixSet="MaterialCommunity"
        prefixName="map-marker-outline"
        suffixSet="Material"
        suffixName="arrow-forward"
        suffixColor={LIGHT}
        borderless
        onPress={() => onResultSelect({prediction: item})}
        style={{paddingLeft: 10}}
      />
    );
  };

  return (
    <View>
      <FlatList
        data={searchResult.predictions}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        ItemSeparatorComponent={ItemSeparator}
        keyboardShouldPersistTaps={'handled'}
        style={{maxHeight: 254}}
      />
    </View>
  );
};

export default AutocompleteResult;

const styles = StyleSheet.create({
  screenBox: {
    paddingHorizontal: 10,
    backgroundColor: 'white',
    flex: 1,
  },
  separator: {
    height: 1,
    borderTopWidth: 1,
    borderColor: DIRTY_WHITE,
  },
});
