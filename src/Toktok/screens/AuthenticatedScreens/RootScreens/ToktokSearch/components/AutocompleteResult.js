import React, {useState, useRef, useEffect, useCallback} from 'react';
import {Text, View, TextInput, StyleSheet, FlatList, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {throttle, debounce} from 'lodash';
import {useLazyQuery} from '@apollo/react-hooks';
import uuid from 'react-native-uuid';
import {GET_GOOGLE_PLACE_DETAILS} from '../../../../../../graphql';
import {WhiteButton, TouchableIcon} from '../../../../../../revamp';
import {DIRTY_WHITE} from '../../../../../../res/constants';
import {COLOR} from '../../../../../../res/variables';
import CONSTANTS from 'common/res/constants';

const ItemSeparator = () => <View style={styles.separator} />;

export const AutocompleteResult = ({searchResult, sessionToken, setSessionToken, onLocationSelect}) => {
  const navigation = useNavigation();

  const [selectedFormattedAddress, setSelectedFormattedAddress] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);

  const [getGooglePlaceDetails, {loading}] = useLazyQuery(GET_GOOGLE_PLACE_DETAILS, {
    fetchPolicy: 'network-only',
    onCompleted: data => {
      console.log({result: data.getGooglePlaceDetails.location});
      setSessionToken(uuid.v4()); // Use new sessionToken after Place Details Request
      onLocationSelect({
        route: selectedRoute,
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
        suffixSet="Entypo"
        suffixName="chevron-thin-right"
        suffixColor={'black'}
        suffixSize={18}
        borderless
        onPress={() => {
          onResultSelect({prediction: item});
          setSelectedRoute('ToktokDelivery');
        }}
        style={{marginHorizontal: 16}}
      />
    );
  };

  const renderItemPabili = ({item}) => {
    const formattedAddressParts = item.formattedAddress.split(',');

    return (
      <WhiteButton
        label={formattedAddressParts[0]}
        description={item.formattedAddress}
        prefixSet="FontAwesome5"
        prefixName="map-marker-alt"
        prefixSize={18}
        prefixColor={COLOR.ORANGE}
        suffixSet="Entypo"
        suffixName="chevron-thin-right"
        suffixColor={'black'}
        suffixSize={18}
        borderless
        onPress={() => {
          onResultSelect({prediction: item});
          setSelectedRoute('Pabili');
        }}
        style={{marginHorizontal: 16}}
      />
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <FlatList
        ListHeaderComponent={() => (
          <View style={{height: 30, justifyContent: 'flex-end', marginHorizontal: 16}}>
            <Text
              style={{
                fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
                fontSize: CONSTANTS.FONT_SIZE.L,
                color: CONSTANTS.COLOR.YELLOW,
              }}>
              toktok delivery
            </Text>
          </View>
        )}
        data={searchResult.predictions}
        renderItem={renderItemDelivery}
        keyExtractor={(item, index) => index}
        ItemSeparatorComponent={ItemSeparator}
        keyboardShouldPersistTaps={'handled'}
        style={{maxHeight: 284}}
      />
      <View style={{height: 8, backgroundColor: CONSTANTS.COLOR.LIGHT, marginVertical: 8}} />
      <FlatList
        ListHeaderComponent={() => (
          <View style={{height: 30, justifyContent: 'flex-end', marginHorizontal: 16}}>
            <Text
              style={{
                fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
                fontSize: CONSTANTS.FONT_SIZE.L,
                color: CONSTANTS.COLOR.YELLOW,
              }}>
              toktok pabili
            </Text>
          </View>
        )}
        data={searchResult.predictions}
        renderItem={renderItemPabili}
        keyExtractor={(item, index) => index}
        ItemSeparatorComponent={ItemSeparator}
        keyboardShouldPersistTaps={'handled'}
        style={{maxHeight: 284}}
      />
    </ScrollView>
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
