import React, {useEffect, useState} from 'react';
import {Text, View, ActivityIndicator, FlatList, TouchableHighlight, StatusBar} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import {GET_GOOGLE_PLACE_DETAILS} from '../../../../../graphql/virtual/Google';
import {GoogleUtility} from '../../../../../util';
import {COLOR, FONT, FONT_SIZE, SIZE} from '../../../../../res/variables';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../../../components';

const NearbyStore = ({store, onStoreSelect}) => {
  return (
    <TouchableHighlight
      style={{marginHorizontal: SIZE.SIDE_MARGIN, borderRadius: SIZE.BORDER_RADIUS}}
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
        <Text numberOfLines={1} style={{color: COLOR.MEDIUM}}>
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

  const [getGooglePlaceDetails, {loading}] = useLazyQuery(GET_GOOGLE_PLACE_DETAILS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log({result: data.getGooglePlaceDetails});

      onNearbySelect({
        value: data.getGooglePlaceDetails,
        storeData: selectedStore,
        nav: navigation,
      });
    },
  });

  const onStoreSelect = (value) => {
    setSelectedStore(value);
    getGooglePlaceDetails({
      variables: {
        input: {
          placeId: value.place_id,
          sessionToken: 'NOT-AVAILABLE',
        },
      },
    });
  };

  const [nearbyStores, setNearbyStores] = useState(null);
  const [error, setError] = useState(false);

  const fetchNearbyStores = async () => {
    const nearbyResponse = await GoogleUtility.placeNearbySearch({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      type: placeType,
      radius: 5000,
    });

    if (nearbyResponse.responseError) {
      setError(true);
    }
    setNearbyStores(nearbyResponse.responseData.results);

    // console.log(JSON.stringify(nearbyResponse.responseData, null, 4));
  };

  useEffect(() => {
    fetchNearbyStores();
  }, []);

  if (error) {
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
      <Text>Something went wrong.</Text>
    </View>;
  }

  if (!nearbyStores) {
    return (
      <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
        <ActivityIndicator color={COLOR.YELLOW} />
      </View>
    );
  }

  if (nearbyStores.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
        <Text>No opean nearby stores found.</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <AlertOverlay visible={loading} />
      <FlatList
        data={nearbyStores}
        renderItem={({item, index}) => <NearbyStore store={item} onStoreSelect={onStoreSelect} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.place_id}
        ItemSeparatorComponent={() => (
          <View style={{borderBottomWidth: 1, marginHorizontal: 20, borderColor: COLOR.LIGHT}} />
        )}
      />
    </View>
  );
};

export default NearbyStores;
