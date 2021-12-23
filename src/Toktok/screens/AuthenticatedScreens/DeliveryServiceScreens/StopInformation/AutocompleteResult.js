import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import uuid from 'react-native-uuid';
import {GET_GOOGLE_PLACE_DETAILS} from '../../../../../graphql';
import {WhiteButton} from '../../../../../revamp';
import {DIRTY_WHITE} from '../../../../../res/constants';
import {COLOR} from '../../../../../res/variables';

const ItemSeparator = () => <View style={styles.separator} />;

const AutocompleteResult = ({searchResult, sessionToken, setSessionToken, onLocationSelect, setSearchText}) => {
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

  const renderItem = ({item}) => {
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
        onPress={() => onResultSelect({prediction: item})}
        style={{marginHorizontal: 16}}
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
