import React, {useEffect, useState} from 'react';
import {View, Text, TouchableHighlight, FlatList, ActivityIndicator} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import {COLOR, COLORS, FONTS, NUMBERS, SIZES} from '../../../../../res/constants';
import {WhiteButton, VectorIcon, Shadow, ICON_SET} from '../../../../../revamp';
import {GET_GOOGLE_PLACE_SEARCH_NEARBY} from '../../../../../graphql';

const renderNearBy = ({item, index}) => {
  return (
    <TouchableHighlight
      onPress={() => {}}
      style={{
        height: 50,
        justifyContent: 'center',
        marginHorizontal: 20,
        borderRadius: 5,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: COLORS.TRANSPARENT_GRAY,
      }}
      underlayColor={COLORS.TRANSPARENT_YELLOW}>
      <View>
        <Text style={{fontFamily: FONTS.REGULAR}}>{item.name}</Text>
        <Text numberOfLines={1} style={{fontFamily: FONTS.REGULAR, fontSize: 12, color: COLORS.MEDIUM}}>
          {item.formattedAddress}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

const NearbyStores = ({userCoordinates}) => {
  const [index, setIndex] = useState(0);
  const [nearbyStores, setNearbyStores] = useState(null);
  const [nearbyGrocery, setNearbyGrocery] = useState([]);
  const [nearbyPharmacy, setNearbyPharmacy] = useState([]);

  const [getGooglePlaceSearchNearby, {loading, error}] = useLazyQuery(GET_GOOGLE_PLACE_SEARCH_NEARBY, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      //   console.log(getGooglePlaceSearchNearby);
      setNearbyStores(data.getGooglePlaceSearchNearby);
      console.log(JSON.stringify(data.getGooglePlaceSearchNearby, null, 4));

      const filteredGrocery = data.getGooglePlaceSearchNearby.filter((store) => {
        const isStore = store.types.includes('grocery_or_supermarket');

        if (isStore) return true;
      });

      setNearbyGrocery(filteredGrocery);

      const filteredPharmacy = data.getGooglePlaceSearchNearby.filter((store) => {
        const isStore = store.types.includes('pharmacy');

        if (isStore) return true;
      });

      setNearbyPharmacy(filteredPharmacy);
    },
    onError: (error) => console.log({error}),
  });

  useEffect(() => {
    getGooglePlaceSearchNearby({
      variables: {
        input: {
          coordinates: userCoordinates,
        },
      },
    });
  }, [userCoordinates]);

  if (!nearbyStores) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator color={COLORS.YELLOW} size={24} />
      </View>
    );
  }

  return (
    <>
      <Shadow style={{margin: 20, borderRadius: NUMBERS.BORDER_RADIUS, marginBottom: 0}}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: NUMBERS.BORDER_RADIUS,
            height: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableHighlight
            onPress={() => {
              setIndex(0);
            }}
            underlayColor={index === 0 ? 'white' : COLORS.LIGHT_YELLOW}
            style={{flex: 1, borderRadius: NUMBERS.BORDER_RADIUS, overflow: 'hidden'}}>
            <View
              style={{
                height: 50,
                width: '100%',
                backgroundColor: index === 0 ? COLORS.TRANSPARENT_YELLOW : 'white',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>{`All (${nearbyStores.length})`}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              setIndex(1);
            }}
            underlayColor={index === 1 ? 'white' : COLORS.LIGHT_YELLOW}
            style={{
              flex: 1,
              borderRadius: NUMBERS.BORDER_RADIUS,
              overflow: 'hidden',
            }}>
            <View
              style={{
                height: 50,
                width: '100%',
                backgroundColor: index === 1 ? COLORS.TRANSPARENT_YELLOW : 'white',
                justifyContent: 'center',
                alignItems: 'center',
                borderRightWidth: 1,
                borderLeftWidth: 1,
                borderColor: COLORS.TRANSPARENT_GRAY,
              }}>
              <Text>{`Grocery (${nearbyGrocery.length})`}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              setIndex(2);
            }}
            underlayColor={index === 2 ? 'white' : COLORS.LIGHT_YELLOW}
            style={{flex: 1, borderRadius: NUMBERS.BORDER_RADIUS, overflow: 'hidden'}}>
            <View
              style={{
                height: 50,
                width: '100%',
                backgroundColor: index === 2 ? COLORS.TRANSPARENT_YELLOW : 'white',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>{`Pharmacy (${nearbyPharmacy.length})`}</Text>
            </View>
          </TouchableHighlight>
        </View>
      </Shadow>
      <View style={{flex: 1}}>
        {index === 0 && <FlatList data={nearbyStores} renderItem={renderNearBy} showsVerticalScrollIndicator={false} />}
        {index === 1 && (
          <FlatList data={nearbyGrocery} renderItem={renderNearBy} showsVerticalScrollIndicator={false} />
        )}
        {index === 2 && (
          <FlatList data={nearbyPharmacy} renderItem={renderNearBy} showsVerticalScrollIndicator={false} />
        )}
      </View>
    </>
  );
};

export default NearbyStores;
