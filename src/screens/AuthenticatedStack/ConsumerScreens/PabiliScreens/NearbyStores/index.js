import React, {useEffect, useState} from 'react';
import {Text, View, ActivityIndicator, FlatList, TouchableHighlight, StatusBar} from 'react-native';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {GET_GOOGLE_PLACE_DETAILS, GET_GOOGLE_PLACE_SEARCH_NEARBY} from '../../../../../graphql';
import {COLOR, FONT, FONT_SIZE, SIZE} from '../../../../../res/variables';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../../components';

const NearbyStore = ({store, onStoreSelect}) => {
  return (
    <TouchableHighlight
      style={{marginHorizontal: SIZE.MARGIN, borderRadius: SIZE.BORDER_RADIUS}}
      onPress={() => {
        onStoreSelect(store);
      }}
      underlayColor={COLOR.WHITE_UNDERLAY}>
      <View
        style={{
          height: 60,
          paddingHorizontal: 10,
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: SIZE.BORDER_RADIUS,
        }}>
        <Text numberOfLines={1} style={{fontFamily: FONT.BOLD}}>
          {store.name}
        </Text>
        <Text numberOfLines={1} style={{color: COLOR.DARK}}>
          {store.vicinity}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

const NearbyStores = ({navigation, route}) => {
  const {label, plural, placeType, coordinates, onNearbySelect} = route.params;
  const [selectedStore, setSelectedStore] = useState(null);

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Nearby', plural]} />,
  });

  const {
    data: fetchData,
    loading: fetchLoading,
    error: fetchError,
  } = useQuery(GET_GOOGLE_PLACE_SEARCH_NEARBY, {
    fetchPolicy: 'network-only',
    variables: {
      input: {
        coordinates,
        type: placeType,
      },
    },
  });

  const [getGooglePlaceDetails, {loading}] = useLazyQuery(GET_GOOGLE_PLACE_DETAILS, {
    fetchPolicy: 'network-only',
    onCompleted: data => {
      console.log({result: data.getGooglePlaceDetails});

      onNearbySelect({
        value: data.getGooglePlaceDetails,
        storeData: selectedStore,
        nav: navigation,
      });
    },
  });

  const onStoreSelect = value => {
    setSelectedStore(value);
    getGooglePlaceDetails({
      variables: {
        input: {
          placeId: value.placeId,
          sessionToken: 'NOT-AVAILABLE',
        },
      },
    });
  };

  if (fetchError) {
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
      <Text>Something went wrong.</Text>
    </View>;
  }

  if (fetchLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
        <ActivityIndicator color={COLOR.YELLOW} />
      </View>
    );
  }

  if (fetchData.getGooglePlaceSearchNearby.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
        <Text>No stores open near you.</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <AlertOverlay visible={loading} />
      <FlatList
        data={fetchData.getGooglePlaceSearchNearby}
        renderItem={({item, index}) => <NearbyStore store={item} onStoreSelect={onStoreSelect} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.place_id}
        ItemSeparatorComponent={() => (
          <View style={{borderBottomWidth: 1, marginHorizontal: 20, borderColor: COLOR.LIGHT}} />
        )}
      />
    </View>
  );
};

export default NearbyStores;
