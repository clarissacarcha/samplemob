import React, {useState, useRef, useEffect, useCallback} from 'react';
import {Text, View, TextInput, StyleSheet, FlatList, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle, debounce} from 'lodash';
import {useLazyQuery} from '@apollo/react-hooks';
import uuid from 'react-native-uuid';
import {GET_GOOGLE_PLACE_DETAILS} from '../../../graphql';
import {WhiteButton, TouchableIcon} from '../../../revamp';
import {DIRTY_WHITE} from '../../../res/constants';
import {COLOR} from '../../../res/variables';
import CONSTANTS from 'common/res/constants';

const ItemSeparator = () => <View style={styles.separator} />;

export const AutocompleteResult = ({searchResult, sessionToken, setSessionToken, onLocationSelect}) => {
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
  };

  const renderItemDelivery = ({item}) => {
    const formattedAddressParts = item.formattedAddress.split(',');

    return (
      <WhiteButton
        label={formattedAddressParts[0]}
        description={item.formattedAddress}
        prefixSet="FontAwesome5"
        prefixName="map-marker-alt"
        prefixSize={18}
        prefixColor={COLOR.ORANGE}
        // suffixSet="Entypo"
        // suffixName="chevron-thin-right"
        // suffixColor={'black'}
        // suffixSize={18}
        borderless
        onPress={() => {
          onResultSelect({prediction: item});
        }}
        style={{marginHorizontal: 16}}
      />
    );
  };

  return (
    <View showsVerticalScrollIndicator={false}>
      <FlatList
        data={searchResult.predictions}
        renderItem={renderItemDelivery}
        keyExtractor={(item, index) => index}
        ItemSeparatorComponent={ItemSeparator}
        keyboardShouldPersistTaps={'handled'}
        style={{maxHeight: 284}}
      />
    </View>
  );
};

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
